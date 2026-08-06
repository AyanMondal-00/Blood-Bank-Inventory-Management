import pool from "../config/db.js";
import {
  getAllInventoryModel,
  createInventoryModel,
  findInventoryByIdModel,
  updateAvailableUnitModel,
  updateBloodPriceModel,
  getBloodPricesModel,
  getPricesByTypeModel,
  getExpiryMonitoringModel,
  getComponentShelfLivesModel,
  getRevisedChargesModel,
  updateRevisedChargeModel,
} from "../models/inventoryModel.js";
import { createTransactionModel } from "../models/transactionModel.js";
import ApiError from "../utils/ApiError.js";

export const getAllInventoryService = async (page, limit) => {
  const offset = (page - 1) * limit;
  console.log({ page, limit, offset });

  return await getAllInventoryModel(limit, offset);
};

const FORM_FIELDS_TO_COMPONENTS = {
  whole_blood: "WHOLE BLOOD",
  packed_cells_sagm: "PACKED CELLS (SAGM)",
  conc_rbcs: "CONC. RBC'S",
  ffp: "FFP",
  platelet_conc: "PLATELET CONC.",
  cryo_ppt_ahf: "CRYO PPT (AHF)",
  cpp: "CPP",
};

export const createInventoryService = async (data, user) => {
  // Input validations
  if (!data.blood_type || !data.entry_date || !data.received_by) {
    throw new ApiError(400, "Missing required fields for inventory reception: blood_type, entry_date, received_by are required.");
  }

  // Validate blood type format
  const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"];
  if (!BLOOD_TYPES.includes(data.blood_type)) {
    throw new ApiError(400, `Invalid blood type selected: ${data.blood_type}`);
  }

  // Validate date format and ensure it's not in the future
  const entryDateObj = new Date(data.entry_date);
  if (isNaN(entryDateObj.getTime())) {
    throw new ApiError(400, "Invalid collection date format.");
  }
  
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (data.entry_date > todayStr) {
    throw new ApiError(400, "Collection date cannot be in the future.");
  }

  if (data.entry_date < todayStr && user && user.role !== "admin") {
    throw new ApiError(403, "Only administrators can select past collection dates. Members can only submit for today's date.");
  }

  // Validate that at least one component has quantity > 0
  const totalReceivedUnits = Object.keys(FORM_FIELDS_TO_COMPONENTS).reduce(
    (sum, field) => sum + Number(data[field] || 0),
    0
  );

  if (totalReceivedUnits === 0) {
    throw new ApiError(400, "Please enter quantity for at least one component.");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch component shelf lives from database component_master
    const shelfLifeRows = await getComponentShelfLivesModel(connection);
    if (!shelfLifeRows || shelfLifeRows.length === 0) {
      throw new ApiError(500, "Component master data could not be retrieved. Please check database seeds.");
    }
    const shelfLifeMap = {};
    shelfLifeRows.forEach((row) => {
      shelfLifeMap[row.component_name] = row.shelf_life_days;
    });

    // 2. Fetch prices from database to calculate transaction values
    const prices = await getPricesByTypeModel(data.blood_type, connection);
    const priceMap = {};
    prices.forEach((p) => {
      priceMap[p.component_type] = Number(p.price);
    });

    // Generate unique batch_id for this receive operation
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const batch_id = `B-${dateStr}-${randomSuffix}`;

    const createdInventories = [];

    // 3. Loop through components and insert separate entries (always insert all 7 components)
    for (const [field, componentName] of Object.entries(FORM_FIELDS_TO_COMPONENTS)) {
      const quantity = Number(data[field] || 0);
      if (quantity < 0) {
        throw new ApiError(400, `Quantity for ${componentName} cannot be negative.`);
      }

      const shelfLifeDays = shelfLifeMap[componentName] || 35;
      const entryDate = new Date(data.entry_date);
      entryDate.setDate(entryDate.getDate() + shelfLifeDays);
      const expiry_date = entryDate.toISOString().split("T")[0];

      const componentPrice = priceMap[componentName] || 0;
      const total_price = quantity * componentPrice;

      const payload = {
        batch_id,
        entry_date: data.entry_date,
        received_by: data.received_by,
        blood_type: data.blood_type,
        component_type: componentName,
        government_price: componentPrice,
        received_unit: quantity,
        expiry_date,
        remarks: data.remarks
      };

      const result = await createInventoryModel(payload, connection);

      await createTransactionModel(
        {
          inventory_id: result.insertId,
          transaction_type: "RECEIVE",
          units: quantity,
          total_price: total_price,
          expiry_date: expiry_date,
          issued_by: data.received_by,
          remarks: data.remarks,
        },
        connection
      );

      createdInventories.push({
        id: result.insertId,
        component_type: componentName,
        received_unit: quantity,
        expiry_date,
      });
    }

    await connection.commit();
    return {
      message: "Inventory and transaction logs saved successfully",
      batch_id,
      records: createdInventories,
    };
  } catch (error) {
    await connection.rollback();
    console.error(`[Creation Error] Transaction rollback executed for createInventoryService. Details:`, error.message);
    throw error;
  } finally {
    connection.release();
  }
};

export const issueBloodService = async (data) => {
  // Input validations
  if (!data.inventory_id || !data.component_type || !data.issued_unit || !data.issued_by) {
    throw new ApiError(400, "Missing required parameters for blood issuing: inventory_id, component_type, issued_unit, issued_by are all required.");
  }

  const issued_unit = Number(data.issued_unit);
  if (isNaN(issued_unit) || issued_unit <= 0) {
    throw new ApiError(400, "Issued unit quantity must be a positive number.");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // SCALABLE ARCHITECTURE: Acquire Row-level Lock (FOR UPDATE) to prevent concurrency race conditions (double issue)
    const [rows] = await connection.query(
      `SELECT * FROM blood_inventory WHERE id = ? FOR UPDATE`,
      [data.inventory_id]
    );
    const inventory = rows[0];

    if (!inventory) {
      throw new ApiError(404, "Inventory batch record not found.");
    }

    if (inventory.component_type !== data.component_type) {
      throw new ApiError(400, `Batch component type mismatch. Batch is ${inventory.component_type}, requested ${data.component_type}`);
    }

    const availableComponentStock = Number(inventory.available_unit);

    if (availableComponentStock < issued_unit) {
      throw new ApiError(400, `Insufficient stock for ${data.component_type}. Only ${availableComponentStock} units available.`);
    }

    const updatedAvailableUnit = availableComponentStock - issued_unit;

    // Update available units in DB
    await connection.query(
      `
      UPDATE blood_inventory
      SET available_unit = ?
      WHERE id = ?
      `,
      [updatedAvailableUnit, inventory.id]
    );

    // Calculate transaction total_price
    const total_price = issued_unit * Number(inventory.government_price || 0);

    const transactionData = {
      inventory_id: inventory.id,
      transaction_type: "ISSUE",
      units: issued_unit,
      total_price: total_price,
      expiry_date: inventory.expiry_date,
      issued_by: data.issued_by,
      remarks: data.remarks,
    };

    await createTransactionModel(transactionData, connection);

    await connection.commit();
    return "Blood issued successfully";
  } catch (error) {
    await connection.rollback();
    console.error(`[Concurrency Error] Transaction rollback executed for issueBloodService. Details:`, error.message);
    throw error;
  } finally {
    connection.release();
  }
};

export const getBloodPricesService = async () => {
  return await getBloodPricesModel();
};

export const updateBloodPriceService = async (blood_type, component_type, new_price) => {
  return await updateBloodPriceModel(blood_type, component_type, new_price);
};

export const getExpiryMonitoringService = async () => {
  return await getExpiryMonitoringModel();
};

export const getRevisedChargesService = async () => {
  return await getRevisedChargesModel();
};

export const updateRevisedChargeService = async (id, new_charge) => {
  return await updateRevisedChargeModel(id, new_charge);
};

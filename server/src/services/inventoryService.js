import pool from "../config/db.js";
import {
  getAllInventoryModel,
  createInventoryModel,
  findExistingInventoryModel,
  updateInventoryUnitsModel,
  findInventoryByIdModel,
  updateAvailableUnitModel,
  updateBloodPriceModel,
  getBloodPricesModel,
  getPricesByTypeModel,
} from "../models/inventoryModel.js";
import { createTransactionModel } from "../models/transactionModel.js";

import ApiError from "../utils/ApiError.js";

export const getAllInventoryService = async (page, limit) => {
  const offset = (page - 1) * limit;
  console.log({ page, limit, offset });

  return await getAllInventoryModel(limit, offset);
};

export const createInventoryService = async (data) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Compute total units received from individual components
    const received_unit =
      Number(data.whole_blood || 0) +
      Number(data.packed_cells_sagm || 0) +
      Number(data.conc_rbcs || 0) +
      Number(data.ffp || 0) +
      Number(data.platelet_conc || 0) +
      Number(data.cryo_ppt_ahf || 0) +
      Number(data.cpp || 0);

    if (received_unit === 0) {
      throw new ApiError(400, "Please enter quantity for at least one component.");
    }

    // Fetch prices from database to calculate total transaction value
    const prices = await getPricesByTypeModel(data.blood_type, connection);
    const priceMap = {};
    prices.forEach((p) => {
      priceMap[p.component_type] = Number(p.price);
    });

    const total_price =
      Number(data.whole_blood || 0) * (priceMap["WHOLE BLOOD"] || 0) +
      Number(data.packed_cells_sagm || 0) * (priceMap["PACKED CELLS (SAGM)"] || 0) +
      Number(data.conc_rbcs || 0) * (priceMap["CONC. RBC'S"] || 0) +
      Number(data.ffp || 0) * (priceMap["FFP"] || 0) +
      Number(data.platelet_conc || 0) * (priceMap["PLATELET CONC."] || 0) +
      Number(data.cryo_ppt_ahf || 0) * (priceMap["CRYO PPT (AHF)"] || 0) +
      Number(data.cpp || 0) * (priceMap["CPP"] || 0);

    // Prepare full data payload with computed units
    const payload = {
      ...data,
      received_unit,
      government_price: priceMap["WHOLE BLOOD"] || 0, // Fallback government price for base column
    };

    const existingInventory = await findExistingInventoryModel(
      data.blood_type,
      data.expiry_date,
      connection
    );

    if (existingInventory) {
      const updatedReceivedUnit = existingInventory.received_unit + received_unit;
      const updatedAvailableUnit = existingInventory.available_unit + received_unit;

      const updatedComponents = {
        whole_blood: Number(existingInventory.whole_blood) + Number(data.whole_blood || 0),
        packed_cells_sagm: Number(existingInventory.packed_cells_sagm) + Number(data.packed_cells_sagm || 0),
        conc_rbcs: Number(existingInventory.conc_rbcs) + Number(data.conc_rbcs || 0),
        ffp: Number(existingInventory.ffp) + Number(data.ffp || 0),
        platelet_conc: Number(existingInventory.platelet_conc) + Number(data.platelet_conc || 0),
        cryo_ppt_ahf: Number(existingInventory.cryo_ppt_ahf) + Number(data.cryo_ppt_ahf || 0),
        cpp: Number(existingInventory.cpp) + Number(data.cpp || 0),
      };

      await updateInventoryUnitsModel(
        existingInventory.id,
        updatedReceivedUnit,
        updatedAvailableUnit,
        updatedComponents,
        connection
      );

      await createTransactionModel(
        {
          inventory_id: existingInventory.id,
          transaction_type: "RECEIVE",
          whole_blood: Number(data.whole_blood || 0),
          packed_cells_sagm: Number(data.packed_cells_sagm || 0),
          conc_rbcs: Number(data.conc_rbcs || 0),
          ffp: Number(data.ffp || 0),
          platelet_conc: Number(data.platelet_conc || 0),
          cryo_ppt_ahf: Number(data.cryo_ppt_ahf || 0),
          cpp: Number(data.cpp || 0),
          units: received_unit,
          total_price: total_price,
          expiry_date: existingInventory.expiry_date,
          issued_by: data.received_by,
          remarks: data.remarks,
        },
        connection
      );

      await connection.commit();
      return {
        message: "Inventory updated successfully",
      };
    }

    const result = await createInventoryModel(payload, connection);

    await createTransactionModel(
      {
        inventory_id: result.insertId,
        transaction_type: "RECEIVE",
        whole_blood: Number(data.whole_blood || 0),
        packed_cells_sagm: Number(data.packed_cells_sagm || 0),
        conc_rbcs: Number(data.conc_rbcs || 0),
        ffp: Number(data.ffp || 0),
        platelet_conc: Number(data.platelet_conc || 0),
        cryo_ppt_ahf: Number(data.cryo_ppt_ahf || 0),
        cpp: Number(data.cpp || 0),
        units: received_unit,
        total_price: total_price,
        expiry_date: data.expiry_date,
        issued_by: data.received_by,
        remarks: data.remarks,
      },
      connection
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const issueBloodService = async (data) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const inventory = await findInventoryByIdModel(data.inventory_id, connection);

    if (!inventory) {
      throw new ApiError(404, "Inventory not found");
    }

    const componentColumnMap = {
      "WHOLE BLOOD": "whole_blood",
      "PACKED CELLS (SAGM)": "packed_cells_sagm",
      "CONC. RBC'S": "conc_rbcs",
      "FFP": "ffp",
      "PLATELET CONC.": "platelet_conc",
      "CRYO PPT (AHF)": "cryo_ppt_ahf",
      "CPP": "cpp",
    };

    const colName = componentColumnMap[data.component_type];
    if (!colName) {
      throw new ApiError(400, "Invalid component type");
    }

    const availableComponentStock = Number(inventory[colName] || 0);
    const issued_unit = Number(data.issued_unit);

    if (availableComponentStock < issued_unit) {
      throw new ApiError(400, `Insufficient stock for ${data.component_type}. Only ${availableComponentStock} units available.`);
    }

    const updatedAvailableUnit = Number(inventory.available_unit) - issued_unit;
    const updatedComponentStock = availableComponentStock - issued_unit;

    // Update available units in DB
    await connection.query(
      `
      UPDATE blood_inventory
      SET 
        available_unit = ?,
        ${colName} = ?
      WHERE id = ?
      `,
      [updatedAvailableUnit, updatedComponentStock, inventory.id]
    );

    // Fetch the price for the specific component to calculate transaction total_price
    const [priceRow] = await connection.query(
      `SELECT price FROM blood_prices WHERE blood_type = ? AND component_type = ? LIMIT 1`,
      [inventory.blood_type, data.component_type]
    );
    const component_price = priceRow ? Number(priceRow[0]?.price || priceRow.price || 0) : 0;
    const total_price = issued_unit * component_price;

    const transactionData = {
      inventory_id: inventory.id,
      transaction_type: "ISSUE",
      units: issued_unit,
      total_price: total_price,
      expiry_date: inventory.expiry_date,
      issued_by: data.issued_by,
      remarks: data.remarks,
    };

    // Initialize all components to 0
    Object.keys(componentColumnMap).forEach((key) => {
      const col = componentColumnMap[key];
      transactionData[col] = 0;
    });
    // Set quantity for the issued component
    transactionData[colName] = issued_unit;

    await createTransactionModel(transactionData, connection);

    await connection.commit();
    return "Blood issued successfully";
  } catch (error) {
    await connection.rollback();
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

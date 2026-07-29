import {
  getAllInventoryModel,
  createInventoryModel,
  findExistingInventoryModel,
  updateInventoryUnitsModel,
} from "../models/inventoryModel.js";
import { createTransactionModel } from "../models/transactionModel.js";
export const getAllInventoryService = async () => {
  return await getAllInventoryModel();
};
// export const createInventoryService = async (data) => {
//   return await createInventoryModel(data);
// };

export const createInventoryService = async (data) => {
  const existingInventory = await findExistingInventoryModel(
    data.location,
    data.blood_type,
    data.expiry_date,
  );
  if (existingInventory) {
    const updatedReceivedUnit =
      existingInventory.received_unit + data.received_unit;

    const updatedAvailableUnit =
      existingInventory.available_unit + data.received_unit;

    await updateInventoryUnitsModel(
      existingInventory.id,
      updatedReceivedUnit,
      updatedAvailableUnit,
    );
    await createTransactionModel({
      inventory_id: existingInventory.id,
      transaction_type: "RECEIVE",
      units: data.received_unit,
      issued_by: "System",
      remarks: data.remarks,
    });
    return {
      message: "Inventory updated successfully",
    };
  }

  const result = await createInventoryModel(data);

  await createTransactionModel({
    inventory_id: result.insertId,
    transaction_type: "RECEIVE",
    units: data.received_unit,
    issued_by: "System",
    remarks: data.remarks,
  });

  return result;
};

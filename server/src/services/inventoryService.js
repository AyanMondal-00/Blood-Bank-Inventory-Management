import {
  getAllInventoryModel,
  createInventoryModel,
  findExistingInventoryModel,
  updateInventoryUnitsModel,
  findInventoryByIdModel,
  updateAvailableUnitModel,
  updateBloodPriceModel,
} from "../models/inventoryModel.js";
import { createTransactionModel } from "../models/transactionModel.js";

import ApiError from "../utils/ApiError.js";

export const getAllInventoryService = async (page, limit) => {
  const offset = (page - 1) * limit;
  console.log({ page, limit, offset });

  return await getAllInventoryModel(limit, offset);
};
// export const createInventoryService = async (data) => {
//   return await createInventoryModel(data);
// };

export const createInventoryService = async (data) => {
  const existingInventory = await findExistingInventoryModel(
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
      issued_by: data.received_by,
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
    issued_by: data.received_by,
    remarks: data.remarks,
  });

  return result;
};
export const issueBloodService = async (data) => {
  const inventory = await findInventoryByIdModel(data.inventory_id);

  if (!inventory) {
    throw new ApiError(404, "Inventory not found");
  }

  console.log(inventory);
  if (inventory.available_unit < data.issued_unit) {
  throw new ApiError(400, "Insufficient stock");
}
const updatedAvailableUnit =
  inventory.available_unit - data.issued_unit;

await updateAvailableUnitModel(
  inventory.id,
  updatedAvailableUnit
);
await createTransactionModel({
  inventory_id: inventory.id,
  transaction_type: "ISSUE",
  units: data.issued_unit,
  issued_by: data.issued_by,
  remarks: data.remarks,
});{
  return "Blood issued successfully";
}
};

export const updateBloodPriceService = async (blood_type, new_price) => {
  return await updateBloodPriceModel(blood_type, new_price);
};

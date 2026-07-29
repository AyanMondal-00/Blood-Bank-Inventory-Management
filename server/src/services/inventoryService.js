import {
  getAllInventoryModel,
  createInventoryModel,
  findExistingInventoryModel,
  updateInventoryUnitsModel,
} from "../models/inventoryModel.js";

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

    return {
      message: "Inventory updated successfully",
    };
  }

  return await createInventoryModel(data);
};

import { getAllInventoryModel } from "../models/inventoryModel.js";
export const getAllInventoryService = async () => {
  return await getAllInventoryModel();
};
export const createInventoryService = async (data) => {
  return data;
};
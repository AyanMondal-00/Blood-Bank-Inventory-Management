import { getAllInventoryService } from "../services/inventoryService.js";

export const getAllInventory = async (req, res) => {
  const data = await getAllInventoryService();

  res.json(data);
};
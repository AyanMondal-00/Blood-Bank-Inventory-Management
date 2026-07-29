import { getAllInventoryService } from "../services/inventoryService.js";

export const getAllInventory = async (req, res) => {
    const data = await getAllInventoryService();
    res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
};
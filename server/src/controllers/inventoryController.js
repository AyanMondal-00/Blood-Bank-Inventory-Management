import { getAllInventoryService } from "../services/inventoryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  getAllInventoryService,
  createInventoryService,
} from "../services/inventoryService.js";

export const getAllInventory = asyncHandler (async (req, res) => {
    const data = await getAllInventoryService();
    res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
  
});
export const createInventory = asyncHandler(async (req, res) => {
  const data = await createInventoryService(req.body);

  res.status(201).json(
    new ApiResponse(201, "Request Received", data)
  );
}); 
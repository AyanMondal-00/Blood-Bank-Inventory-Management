import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

import {
  getAllInventoryService,
  createInventoryService,
   issueBloodService,
} from "../services/inventoryService.js";

export const getAllInventory = asyncHandler(async (req, res) => {
  const data = await getAllInventoryService();

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

export const createInventory = asyncHandler(async (req, res) => {
  const result = await createInventoryService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Inventory created successfully", result));
});
export const issueBlood = asyncHandler(async (req, res) => {
  const result = await issueBloodService(req.body);

  res.status(200).json(
    new ApiResponse(200, result, "Blood issued successfully")
  );
});

export const getAllInventoryController = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await getAllInventoryService(page, limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Inventory fetched successfully",
      data
    )
  );
};
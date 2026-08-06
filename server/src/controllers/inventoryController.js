import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

import {
  getAllInventoryService,
  createInventoryService,
  issueBloodService,
  updateBloodPriceService,
  getBloodPricesService,
  getExpiryMonitoringService,
} from "../services/inventoryService.js";

export const getAllInventory = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await getAllInventoryService(page, limit);

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

export const createInventory = asyncHandler(async (req, res) => {
  const result = await createInventoryService(req.body, req.user);

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

export const getBloodPrices = asyncHandler(async (req, res) => {
  const result = await getBloodPricesService();

  res.status(200).json(
    new ApiResponse(200, "Blood prices fetched successfully", result)
  );
});

export const updateBloodPrice = asyncHandler(async (req, res) => {
  const { blood_type, component_type, new_price } = req.body;
  if (!blood_type || !component_type || new_price === undefined || Number(new_price) < 0) {
    res.status(400);
    throw new Error("Invalid blood type, component type or price");
  }

  const result = await updateBloodPriceService(blood_type, component_type, Number(new_price));

  res.status(200).json(
    new ApiResponse(200, "Blood price updated successfully", result)
  );
});

export const getExpiryMonitoring = asyncHandler(async (req, res) => {
  const result = await getExpiryMonitoringService();

  res.status(200).json(
    new ApiResponse(200, "Expiry monitoring records fetched successfully", result)
  );
});
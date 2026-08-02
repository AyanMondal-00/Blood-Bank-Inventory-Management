import { getDashboardService } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardService();

  res.status(200).json(
  new ApiResponse(
    200,
    "Dashboard fetched successfully",
    data
  ))
})
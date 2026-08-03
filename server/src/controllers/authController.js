import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { registerService, loginService, getUserProfileService } from "../services/authService.js";

// Register Controller
export const register = asyncHandler(async (req, res) => {
  const result = await registerService(req.body);
  res.status(201).json(
    new ApiResponse(201, "User registered successfully", result)
  );
});

// Login Controller
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.status(200).json(
    new ApiResponse(200, "Logged in successfully", result)
  );
});

// Get User Profile Controller
export const getProfile = asyncHandler(async (req, res) => {
  const result = await getUserProfileService(req.user.id);
  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", result)
  );
});

import jwt from "jsonwebtoken";
import { findUserByIdModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Authenticate JWT Token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (excluding password as it was already excluded in findUserByIdModel)
      const user = await findUserByIdModel(decoded.id);
      if (!user) {
        throw new ApiError(401, "User not found, authorization denied");
      }

      // Attach user to req
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      throw new ApiError(401, "Not authorized, token failed");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }
});

// Admin access check middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new ApiError(403, "Not authorized, admin privileges required");
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmailModel, createUserModel, findUserByIdModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";

// Register Service
export const registerService = async (userData) => {
  const { first_name, last_name, email, password, role } = userData;

  if (!first_name || !last_name || !email || !password) {
    throw new ApiError(400, "All fields (first_name, last_name, email, password) are required");
  }

  // Check if email already exists
  const existingUser = await findUserByEmailModel(email);
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  try {
    const result = await createUserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role
    });

    return {
      id: result.insertId,
      first_name,
      last_name,
      email,
      role: role || "user"
    };
  } catch (error) {
    console.error("Database User Creation Error:", error);
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      throw new ApiError(400, "Email is already registered");
    }
    throw new ApiError(500, "Internal Server Error during user registration");
  }
};

// Login Service
export const loginService = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await findUserByEmailModel(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    },
    token
  };
};

// Get User Profile Service
export const getUserProfileService = async (userId) => {
  const user = await findUserByIdModel(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

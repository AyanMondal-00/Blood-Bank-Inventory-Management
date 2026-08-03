import ApiError from "../utils/ApiError.js";

// Input Validation for User Registration
export const validateRegister = (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || typeof first_name !== "string" || !first_name.trim()) {
    throw new ApiError(400, "First name is required");
  }
  if (!last_name || typeof last_name !== "string" || !last_name.trim()) {
    throw new ApiError(400, "Last name is required");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // Email format validation (Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Password length validation
  if (!password || typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Role validation
  if (role && !["admin", "user"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'admin' or 'user'");
  }

  next();
};

// Input Validation for User Login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    throw new ApiError(400, "Password is required");
  }

  next();
};

import ApiError from "../utils/ApiError.js";

export const validateCreateInventory = (req, res, next) => {
  const {
    entry_date,
    received_by,
    blood_type,
    government_price,
    received_unit,
    expiry_date,
  } = req.body;

  // 1. Presence validations
  if (!entry_date) {
    throw new ApiError(400, "Entry date is required");
  }
  if (!received_by || typeof received_by !== "string" || !received_by.trim()) {
    throw new ApiError(400, "Received by field is required");
  }
  if (!blood_type) {
    throw new ApiError(400, "Blood type is required");
  }
  if (government_price === undefined || government_price === null) {
    throw new ApiError(400, "Government price is required");
  }
  if (received_unit === undefined || received_unit === null) {
    throw new ApiError(400, "Received unit is required");
  }
  if (!expiry_date) {
    throw new ApiError(400, "Expiry date is required");
  }

  // 2. Type & range validations
  const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  if (!validBloodGroups.includes(blood_type)) {
    throw new ApiError(400, "Invalid blood type");
  }

  const numReceivedUnit = Number(received_unit);
  if (!Number.isInteger(numReceivedUnit) || numReceivedUnit <= 0) {
    throw new ApiError(400, "Received unit must be a positive integer");
  }

  const numGovPrice = Number(government_price);
  if (isNaN(numGovPrice) || numGovPrice < 0) {
    throw new ApiError(400, "Government price must be a valid positive number");
  }

  // 3. Date validations
  const entryDate = new Date(entry_date);
  const expiryDate = new Date(expiry_date);

  if (isNaN(entryDate.getTime())) {
    throw new ApiError(400, "Entry date is invalid");
  }
  if (isNaN(expiryDate.getTime())) {
    throw new ApiError(400, "Expiry date is invalid");
  }

  if (expiryDate <= entryDate) {
    throw new ApiError(400, "Expiry date must be greater than entry date");
  }

  next();
};
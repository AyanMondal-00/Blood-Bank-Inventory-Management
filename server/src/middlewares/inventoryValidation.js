import ApiError from "../utils/ApiError.js";

export const validateCreateInventory = (req, res, next) => {
  const {
    entry_date,
    location,
    blood_type,
    government_price,
    received_unit,
    expiry_date,
  } = req.body;

  if (!entry_date) {
    throw new ApiError(400, "Entry date is required");
  }

  if (!location) {
    throw new ApiError(400, "Location is required");
  }

  if (!blood_type) {
    throw new ApiError(400, "Blood type is required");
  }

  if (government_price === undefined) {
    throw new ApiError(400, "Government price is required");
  }

  if (received_unit === undefined) {
    throw new ApiError(400, "Received unit is required");
  }

  if (!expiry_date) {
    throw new ApiError(400, "Expiry date is required");
  }

  next();
};
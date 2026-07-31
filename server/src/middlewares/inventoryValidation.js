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
  const validBloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
if (!Number.isInteger(received_unit) || received_unit <= 0) {
  throw new ApiError(400, "Received unit must be a positive integer");
}
if (
  typeof government_price !== "number" ||
  government_price < 0
) {
  throw new ApiError(
    400,
    "Government price must be a valid positive number"
  );
}

if (!validBloodGroups.includes(blood_type)) {
  throw new ApiError(400, "Invalid blood type");
}

const entryDate = new Date(entry_date);
const expiryDate = new Date(expiry_date);

if (expiryDate <= entryDate) {
  throw new ApiError(
    400,
    "Expiry date must be greater than entry date"
  );
}
  if (!entry_date) {
    throw new ApiError(400, "Entry date is required");
  }

  if (!received_by) {
    throw new ApiError(400, "Received by field is required");
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
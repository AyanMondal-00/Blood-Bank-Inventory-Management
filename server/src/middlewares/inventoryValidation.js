import ApiError from "../utils/ApiError.js";

export const validateCreateInventory = (req, res, next) => {
  const {
    entry_date,
    received_by,
    blood_type,
    whole_blood,
    packed_cells_sagm,
    conc_rbcs,
    ffp,
    platelet_conc,
    cryo_ppt_ahf,
    cpp,
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
  // 2. Type & range validations for blood groups
  const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"];
  if (!validBloodGroups.includes(blood_type)) {
    throw new ApiError(400, "Invalid blood type");
  }

  // Validate component quantities
  const components = {
    whole_blood,
    packed_cells_sagm,
    conc_rbcs,
    ffp,
    platelet_conc,
    cryo_ppt_ahf,
    cpp,
  };

  let totalUnits = 0;
  for (const [key, value] of Object.entries(components)) {
    if (value !== undefined && value !== null && value !== "") {
      const numVal = Number(value);
      if (!Number.isInteger(numVal) || numVal < 0) {
        throw new ApiError(400, `${key} quantity must be a non-negative integer`);
      }
      totalUnits += numVal;
    }
  }

  if (totalUnits <= 0) {
    throw new ApiError(400, "At least one component must have a positive quantity.");
  }

  if (totalUnits > 3000) {
    throw new ApiError(400, "Total units cannot exceed 3000 bags at a single time.");
  }

  // 3. Date validations
  const entryDate = new Date(entry_date);

  if (isNaN(entryDate.getTime())) {
    throw new ApiError(400, "Entry date is invalid");
  }

  next();
};
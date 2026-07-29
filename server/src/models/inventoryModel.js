import pool from "../config/db.js";

export const getAllInventoryModel = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM blood_inventory ORDER BY id DESC"
  );

  return rows;
};
export const createInventoryModel = async (data) => {
  const {
    entry_date,
    location,
    blood_type,
    government_price,
    received_unit,
    
    expiry_date,
    remarks,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO blood_inventory (
  entry_date,
  location,
  blood_type,
  government_price,
  received_unit,
  available_unit,
  expiry_date,
  remarks
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
  entry_date,
  location,
  blood_type,
  government_price,
  received_unit,
  received_unit, // available_unit backend থেকে সেট হচ্ছে
  expiry_date,
  remarks,
]
  );

  return result;
};

export const findExistingInventoryModel = async (
  location,
  blood_type,
  expiry_date
) => {

  const [rows] = await pool.query(
  `
  SELECT *
  FROM blood_inventory
  WHERE location = ?
    AND blood_type = ?
    AND expiry_date = ?
  LIMIT 1
  `,
  [location, blood_type, expiry_date]
);

return rows[0];

};

export const updateInventoryUnitsModel = async (
  id,
  received_unit,
  available_unit
) => {
  const [result] = await pool.query(
    `
    UPDATE blood_inventory
    SET
      received_unit = ?,
      available_unit = ?
    WHERE id = ?
    `,
    [received_unit, available_unit, id]
  );

  return result;
};
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
    available_unit,
    expiry_date,
    remarks,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO blood_inventory (entry_date, location, blood_type, government_price, received_unit, available_unit, expiry_date, remarks) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry_date,
      location,
      blood_type,
      government_price,
      received_unit,
      available_unit,
      expiry_date,
      remarks,
    ]
  );

  return result;
};
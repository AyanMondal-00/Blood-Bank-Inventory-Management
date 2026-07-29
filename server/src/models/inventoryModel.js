import pool from "../config/db.js";

export const getAllInventoryModel = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM blood_inventory ORDER BY id DESC"
  );

  return rows;
};
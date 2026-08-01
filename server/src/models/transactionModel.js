import pool from "../config/db.js";

export const createTransactionModel = async (data) => {
  const {
    inventory_id,
    transaction_type,
    units,
    issued_by,
    remarks,
    total_price,
    expiry_date,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO blood_transactions
    (inventory_id, transaction_type, units, total_price, expiry_date, issued_by, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      inventory_id,
      transaction_type,
      units,
      total_price,
      expiry_date,
      issued_by,
      remarks,
    ]
  );

  return result;
};

export const getAllTransactionsModel = async () => {
  const [rows] = await pool.query(`
    SELECT t.*, i.blood_type 
    FROM blood_transactions t 
    LEFT JOIN blood_inventory i ON t.inventory_id = i.id 
    ORDER BY t.created_at DESC
  `);
  return rows;
};
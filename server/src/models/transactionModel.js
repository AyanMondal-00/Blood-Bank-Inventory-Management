import pool from "../config/db.js";

export const createTransactionModel = async (data, connection = pool) => {
  const {
    inventory_id,
    transaction_type,
    units,
    issued_by,
    remarks,
    total_price,
    expiry_date,
  } = data;

  const [result] = await connection.query(
    `
    INSERT INTO blood_transactions
    (
      inventory_id, transaction_type, 
      units, total_price, expiry_date, issued_by, remarks
    )
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
    SELECT t.*, i.blood_type, i.component_type, i.batch_id
    FROM blood_transactions t 
    LEFT JOIN blood_inventory i ON t.inventory_id = i.id 
    ORDER BY t.created_at DESC
  `);
  return rows;
};

export const getDailyTransactionsModel = async () => {
  const [rows] = await pool.query(`
    SELECT t.*, i.blood_type, i.component_type, i.batch_id
    FROM blood_transactions t 
    LEFT JOIN blood_inventory i ON t.inventory_id = i.id 
    WHERE DATE(t.created_at) = CURDATE()
    ORDER BY t.created_at DESC
  `);
  return rows;
};
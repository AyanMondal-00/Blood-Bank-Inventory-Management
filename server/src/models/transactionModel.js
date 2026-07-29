import pool from "../config/db.js";

export const createTransactionModel = async (data) => {
  const {
    inventory_id,
    transaction_type,
    units,
    issued_by,
    remarks,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO blood_transactions
    (inventory_id, transaction_type, units, issued_by, remarks)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      inventory_id,
      transaction_type,
      units,
      issued_by,
      remarks,
    ]
  );

  return result;
};
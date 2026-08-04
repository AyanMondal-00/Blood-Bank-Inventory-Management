import pool from "../config/db.js";

export const createTransactionModel = async (data, connection = pool) => {
  const {
    inventory_id,
    transaction_type,
    whole_blood,
    packed_cells_sagm,
    conc_rbcs,
    ffp,
    platelet_conc,
    cryo_ppt_ahf,
    cpp,
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
      whole_blood, packed_cells_sagm, conc_rbcs, ffp, platelet_conc, cryo_ppt_ahf, cpp,
      units, total_price, expiry_date, issued_by, remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      inventory_id,
      transaction_type,
      whole_blood || 0,
      packed_cells_sagm || 0,
      conc_rbcs || 0,
      ffp || 0,
      platelet_conc || 0,
      cryo_ppt_ahf || 0,
      cpp || 0,
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
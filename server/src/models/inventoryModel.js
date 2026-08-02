import pool from "../config/db.js";

export const getAllInventoryModel = async (limit, offset) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      entry_date,
      received_by,
      blood_type,
      government_price,
      received_unit,
      available_unit,
      expiry_date,
      remarks,
      created_at,
      updated_at
    FROM blood_inventory
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset]
  );

  return rows;
};
export const createInventoryModel = async (data) => {
  const {
    entry_date,
    received_by,
    blood_type,
    government_price,
    received_unit, 
    expiry_date,
    remarks,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO blood_inventory (
  entry_date,
  received_by,
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
  received_by,
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
  blood_type,
  expiry_date
) => {

  const [rows] = await pool.query(
  `
  SELECT *
  FROM blood_inventory
  WHERE blood_type = ?
    AND expiry_date = ?
  LIMIT 1
  `,
  [blood_type, expiry_date]
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

export const findInventoryByIdModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM blood_inventory
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};
export const updateAvailableUnitModel = async (
  id,
  available_unit
) => {
  const [result] = await pool.query(
    `
    UPDATE blood_inventory
    SET available_unit = ?
    WHERE id = ?
    `,
    [available_unit, id]
  );

  return result;
};

export const getBloodPricesModel = async () => {
  const [rows] = await pool.query(
    `
    SELECT blood_type, price, updated_at
    FROM blood_prices
    ORDER BY blood_type ASC
    `
  );
  return rows;
};

export const updateBloodPriceModel = async (blood_type, new_price) => {
  // Update standard price in blood_prices table (handles insert or update)
  await pool.query(
    `
    INSERT INTO blood_prices (blood_type, price)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE price = ?
    `,
    [blood_type, new_price, new_price]
  );

  // Update blood_inventory so that current stock shows the updated price
  const [result] = await pool.query(
    `
    UPDATE blood_inventory
    SET government_price = ?
    WHERE blood_type = ?
    `,
    [new_price, blood_type]
  );

  return result;
};
import pool from "../config/db.js";

export const getAllInventoryModel = async (limit, offset, connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT
      id,
      batch_id,
      entry_date,
      received_by,
      blood_type,
      component_type,
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

export const createInventoryModel = async (data, connection = pool) => {
  const {
    batch_id,
    entry_date,
    received_by,
    blood_type,
    component_type,
    government_price,
    received_unit, 
    expiry_date,
    remarks,
  } = data;

  const [result] = await connection.query(
    `INSERT INTO blood_inventory (
      batch_id,
      entry_date,
      received_by,
      blood_type,
      component_type,
      government_price,
      received_unit,
      available_unit,
      expiry_date,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      batch_id,
      entry_date,
      received_by,
      blood_type,
      component_type,
      government_price || 0,
      received_unit,
      received_unit, // available_unit defaults to received_unit on creation
      expiry_date,
      remarks,
    ]
  );

  return result;
};

export const getExpiryMonitoringModel = async (connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT *
    FROM blood_inventory
    WHERE available_unit > 0
    ORDER BY expiry_date ASC
    `
  );
  return rows;
};

export const getComponentShelfLivesModel = async (connection = pool) => {
  const [rows] = await connection.query(
    `SELECT component_name, shelf_life_days FROM component_master`
  );
  return rows;
};

export const findInventoryByIdModel = async (id, connection = pool) => {
  const [rows] = await connection.query(
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
  available_unit,
  connection = pool
) => {
  const [result] = await connection.query(
    `
    UPDATE blood_inventory
    SET available_unit = ?
    WHERE id = ?
    `,
    [available_unit, id]
  );

  return result;
};

export const getPricesByTypeModel = async (blood_type, connection = pool) => {
  const [rows] = await connection.query(
    `SELECT component_type, price FROM blood_prices WHERE blood_type = ?`,
    [blood_type]
  );
  return rows;
};

export const getBloodPricesModel = async (connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT id, blood_type, component_type, price, updated_at
    FROM blood_prices
    ORDER BY blood_type ASC, component_type ASC
    `
  );
  return rows;
};

export const updateBloodPriceModel = async (
  blood_type,
  component_type,
  new_price,
  connection = pool
) => {
  const [result] = await connection.query(
    `
    INSERT INTO blood_prices (blood_type, component_type, price)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE price = ?
    `,
    [blood_type, component_type, new_price, new_price]
  );

  return result;
};

export const getRevisedChargesModel = async (connection = pool) => {
  const [rows] = await connection.query(
    `SELECT id, services_name, revised_charges_per_unit FROM revised_processing_charges ORDER BY id ASC`
  );
  return rows;
};

export const updateRevisedChargeModel = async (id, new_charge, connection = pool) => {
  const [result] = await connection.query(
    `UPDATE revised_processing_charges SET revised_charges_per_unit = ? WHERE id = ?`,
    [new_charge, id]
  );
  return result;
};
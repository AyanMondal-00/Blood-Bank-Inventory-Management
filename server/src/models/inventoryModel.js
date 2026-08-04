import pool from "../config/db.js";

export const getAllInventoryModel = async (limit, offset, connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT
      id,
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
    government_price,
    received_unit, 
    expiry_date,
    remarks,
  } = data;

  const [result] = await connection.query(
    `INSERT INTO blood_inventory (
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
      government_price,
      received_unit,
      available_unit,
      expiry_date,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry_date,
      received_by,
      blood_type,
      whole_blood || 0,
      packed_cells_sagm || 0,
      conc_rbcs || 0,
      ffp || 0,
      platelet_conc || 0,
      cryo_ppt_ahf || 0,
      cpp || 0,
      government_price || 0,
      received_unit,
      received_unit, // available_unit defaults to received_unit on creation
      expiry_date,
      remarks,
    ]
  );

  return result;
};

export const findExistingInventoryModel = async (
  blood_type,
  expiry_date,
  connection = pool
) => {
  const [rows] = await connection.query(
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
  available_unit,
  component_data,
  connection = pool
) => {
  const {
    whole_blood,
    packed_cells_sagm,
    conc_rbcs,
    ffp,
    platelet_conc,
    cryo_ppt_ahf,
    cpp,
  } = component_data;

  const [result] = await connection.query(
    `
    UPDATE blood_inventory
    SET
      received_unit = ?,
      available_unit = ?,
      whole_blood = ?,
      packed_cells_sagm = ?,
      conc_rbcs = ?,
      ffp = ?,
      platelet_conc = ?,
      cryo_ppt_ahf = ?,
      cpp = ?
    WHERE id = ?
    `,
    [
      received_unit,
      available_unit,
      whole_blood,
      packed_cells_sagm,
      conc_rbcs,
      ffp,
      platelet_conc,
      cryo_ppt_ahf,
      cpp,
      id,
    ]
  );

  return result;
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
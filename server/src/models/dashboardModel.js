import pool from "../config/db.js";

export const getTotalAvailableUnitsModel = async () => {
  const [rows] = await pool.query(`
    SELECT SUM(available_unit) AS totalAvailable
    FROM blood_inventory
  `);
  return {
    totalAvailable: Number(rows[0].totalAvailable || 0),
  };
  return rows[0];
};

export const getDashboardStatsModel = async () => {
  const [rows] = await pool.query(`
    SELECT
      SUM(received_unit) AS totalReceivedUnits,
      SUM(available_unit) AS totalAvailableUnits,
      COUNT(*) AS totalInventoryRecords,
      COUNT(DISTINCT blood_type) AS totalBloodGroups
    FROM blood_inventory
  `);

  return {
    totalReceivedUnits: Number(rows[0].totalReceivedUnits || 0),
    totalAvailableUnits: Number(rows[0].totalAvailableUnits || 0),
    totalInventoryRecords: Number(rows[0].totalInventoryRecords || 0),
    totalBloodGroups: Number(rows[0].totalBloodGroups || 0),
  };
};

export const getTodayTransactionStatsModel = async () => {
  const [rows] = await pool.query(`
    SELECT
      SUM(CASE WHEN transaction_type = 'RECEIVE' THEN units ELSE 0 END) AS todayReceived,
      SUM(CASE WHEN transaction_type = 'ISSUE' THEN units ELSE 0 END) AS todayIssued
    FROM blood_transactions
    WHERE DATE(created_at) = CURDATE()
  `);

  return {
    todayReceived: Number(rows[0].todayReceived || 0),
    todayIssued: Number(rows[0].todayIssued || 0),
  };
};

export const getLowStockCountModel = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS lowStockCount
    FROM blood_inventory
    WHERE available_unit <= 5
  `);

  return {
    lowStockCount: Number(rows[0].lowStockCount || 0),
  };
};

export const getExpiringSoonCountModel = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS expiringSoonCount
    FROM blood_inventory
    WHERE expiry_date BETWEEN CURDATE()
    AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  `);

  return {
    expiringSoonCount: Number(rows[0].expiringSoonCount || 0),
  };
};

export const getBloodGroupStatsModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      bp.blood_type, 
      bp.price AS government_price, 
      COALESCE(SUM(bi.received_unit), 0) AS totalReceived, 
      COALESCE(SUM(bi.available_unit), 0) AS totalAvailable 
    FROM blood_prices bp
    LEFT JOIN blood_inventory bi ON bp.blood_type = bi.blood_type
    GROUP BY bp.blood_type, bp.price
    ORDER BY bp.blood_type ASC
  `);
  return rows;
};
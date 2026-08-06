import pool from "./config/db.js";

async function checkPrices() {
  const [rows] = await pool.query("SELECT DISTINCT blood_type, component_type, price FROM blood_prices LIMIT 14");
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

checkPrices();

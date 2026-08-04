import pool from "./config/db.js";

async function check() {
  try {
    const [prices] = await pool.query("SELECT COUNT(*) as cnt FROM blood_prices");
    console.log("Total blood_prices rows:", prices[0].cnt);
    
    const [pricesSample] = await pool.query("SELECT * FROM blood_prices LIMIT 10");
    console.log("Sample blood_prices:", pricesSample);

    const [inventory] = await pool.query("SELECT * FROM blood_inventory");
    console.log("All blood_inventory items:", inventory);

    const [transactions] = await pool.query("SELECT * FROM blood_transactions");
    console.log("All blood_transactions items:", transactions);

    process.exit(0);
  } catch (error) {
    console.error("Error reading database:", error);
    process.exit(1);
  }
}

check();

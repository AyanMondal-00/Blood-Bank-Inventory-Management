import pool from "./config/db.js";

async function setup() {
  try {
    console.log("Creating blood_prices table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blood_prices (
        blood_type VARCHAR(5) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (blood_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("blood_prices table created successfully.");
    
    // Check if there are entries, seed them if empty
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM blood_prices");
    if (rows[0].count === 0) {
      console.log("Seeding blood_prices table with default prices...");
      const defaultPrices = [
        ["A+", 550.00],
        ["A-", 600.00],
        ["B+", 650.00],
        ["B-", 600.00],
        ["AB+", 450.00],
        ["AB-", 500.00],
        ["O+", 500.00],
        ["O-", 550.00]
      ];
      for (const [type, price] of defaultPrices) {
        await pool.query("INSERT INTO blood_prices (blood_type, price) VALUES (?, ?)", [type, price]);
      }
      console.log("blood_prices table seeded successfully.");
    } else {
      console.log("blood_prices table already contains data.");
    }
    
    console.log("Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setup();

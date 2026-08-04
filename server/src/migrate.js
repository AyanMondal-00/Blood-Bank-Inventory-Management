import pool from "./config/db.js";

async function migrate() {
  try {
    console.log("Starting database migration...");
    
    // Check if column already exists
    const [columns] = await pool.query("SHOW COLUMNS FROM blood_inventory LIKE 'component_type'");
    if (columns.length === 0) {
      console.log("Adding component_type column to blood_inventory table...");
      await pool.query(`
        ALTER TABLE blood_inventory 
        ADD COLUMN component_type VARCHAR(50) NOT NULL DEFAULT 'WHOLE BLOOD' AFTER blood_type
      `);
      console.log("component_type column added successfully.");
    } else {
      console.log("component_type column already exists in blood_inventory.");
    }
    
    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

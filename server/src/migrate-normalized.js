import pool from "./config/db.js";

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log("Starting normalized database migration...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    // 1. Drop existing tables if they exist
    console.log("Dropping old tables...");
    await connection.query("DROP TABLE IF EXISTS blood_transactions");
    await connection.query("DROP TABLE IF EXISTS blood_inventory");
    await connection.query("DROP TABLE IF EXISTS component_master");

    // 2. Create component_master table
    console.log("Creating component_master table...");
    await connection.query(`
      CREATE TABLE component_master (
        id INT NOT NULL AUTO_INCREMENT,
        component_name VARCHAR(50) NOT NULL UNIQUE,
        shelf_life_days INT NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed component_master data
    console.log("Seeding component_master table...");
    const componentSeeds = [
      ["WHOLE BLOOD", 35],
      ["PACKED CELLS (SAGM)", 42],
      ["CONC. RBC'S", 35],
      ["FFP", 365],
      ["PLATELET CONC.", 5],
      ["CRYO PPT (AHF)", 365],
      ["CPP", 365]
    ];
    for (const [name, shelfLife] of componentSeeds) {
      await connection.query(
        "INSERT INTO component_master (component_name, shelf_life_days) VALUES (?, ?)",
        [name, shelfLife]
      );
    }

    // 3. Create normalized blood_inventory table
    console.log("Creating normalized blood_inventory table...");
    await connection.query(`
      CREATE TABLE blood_inventory (
        id INT NOT NULL AUTO_INCREMENT,
        batch_id VARCHAR(50) NOT NULL,
        entry_date DATE NOT NULL,
        received_by VARCHAR(100) NOT NULL,
        blood_type VARCHAR(5) NOT NULL,
        component_type ENUM('WHOLE BLOOD','PACKED CELLS (SAGM)','CONC. RBC\\'S','FFP','PLATELET CONC.','CRYO PPT (AHF)','CPP') NOT NULL,
        government_price DECIMAL(10,2) NOT NULL,
        received_unit INT NOT NULL,
        available_unit INT NOT NULL DEFAULT '0',
        expiry_date DATE NOT NULL,
        remarks TEXT,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_batch (batch_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Create normalized blood_transactions table
    console.log("Creating normalized blood_transactions table...");
    await connection.query(`
      CREATE TABLE blood_transactions (
        id INT NOT NULL AUTO_INCREMENT,
        inventory_id INT NOT NULL,
        transaction_type ENUM('RECEIVE','ISSUE') NOT NULL,
        units INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        expiry_date DATE NOT NULL,
        issued_by VARCHAR(100) NOT NULL,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_inventory (inventory_id),
        CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES blood_inventory (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed blood_inventory and blood_transactions
    console.log("Seeding blood_inventory and blood_transactions...");
    await connection.query(`
      INSERT INTO blood_inventory (id, batch_id, entry_date, received_by, blood_type, component_type, government_price, received_unit, available_unit, expiry_date, remarks, created_at, updated_at) VALUES 
      (1,'B-20260804-0001','2026-08-04','Ayan Mondal','A+','WHOLE BLOOD',560.00,10,10,'2026-09-08','Initial inventory seed','2026-08-04 10:00:00','2026-08-04 10:00:00'),
      (2,'B-20260804-0002','2026-08-04','Spandan Koner','B+','PLATELET CONC.',650.00,5,3,'2026-08-09','Seeded platelet batch','2026-08-04 10:05:00','2026-08-04 10:15:00')
    `);

    await connection.query(`
      INSERT INTO blood_transactions (id, inventory_id, transaction_type, units, total_price, expiry_date, issued_by, remarks, created_at) VALUES 
      (1,1,'RECEIVE',10,5600.00,'2026-09-08','Ayan Mondal','Initial inventory seed','2026-08-04 10:00:00'),
      (2,2,'RECEIVE',5,3250.00,'2026-08-09','Spandan Koner','Seeded platelet batch','2026-08-04 10:05:00'),
      (3,2,'ISSUE',2,1300.00,'2026-08-09','Ayan Mondal','Issued units','2026-08-04 10:15:00')
    `);

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database migration ran successfully! All tables normalized.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (_) {}
    process.exit(1);
  } finally {
    connection.release();
  }
}

runMigration();

import pool from "./config/db.js";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMPONENTS = [
  "WHOLE BLOOD",
  "PACKED CELLS (SAGM)",
  "CONC. RBC'S",
  "FFP",
  "PLATELET CONC.",
  "CRYO PPT (AHF)",
  "CPP"
];

const DEFAULT_PRICES = {
  "WHOLE BLOOD": 560.00,
  "PACKED CELLS (SAGM)": 540.00,
  "CONC. RBC'S": 650.00,
  "FFP": 750.00,
  "PLATELET CONC.": 655.00,
  "CRYO PPT (AHF)": 650.00,
  "CPP": 750.00
};

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log("Seeding all 56 blood price combinations...");
    await connection.beginTransaction();

    for (const type of BLOOD_TYPES) {
      for (const comp of COMPONENTS) {
        const price = DEFAULT_PRICES[comp];
        await connection.query(`
          INSERT INTO blood_prices (blood_type, component_type, price)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE price = VALUES(price)
        `, [type, comp, price]);
      }
    }

    await connection.commit();
    console.log("Successfully seeded 56 pricing configurations!");
    process.exit(0);
  } catch (error) {
    await connection.rollback();
    console.error("Seeding prices failed:", error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

seed();

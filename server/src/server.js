import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";
import { startBackupScheduler } from "./utils/backupScheduler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
try {
  const connection = await pool.getConnection();
  console.log("✅ Database Connected");
  connection.release();
  
  // Start the automated transaction exporter
  startBackupScheduler();
} catch (error) {
  console.error("❌ Database Connection Failed:", error.message);
}

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

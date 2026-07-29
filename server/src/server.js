import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
try {
  const connection = await pool.getConnection();
  console.log("✅ Database Connected");
  connection.release();
} catch (error) {
  console.error("❌ Database Connection Failed:", error.message);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

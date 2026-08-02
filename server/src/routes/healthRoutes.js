import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const healthStatus = {
    status: "UP",
    timestamp: new Date(),
    services: {
      server: "OK",
      database: "UNKNOWN"
    },
    system: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  };

  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    healthStatus.services.database = "OK";
    res.status(200).json({
      success: true,
      message: "System is healthy",
      data: healthStatus
    });
  } catch (error) {
    healthStatus.status = "DOWN";
    healthStatus.services.database = "DOWN";
    healthStatus.error = error.message;
    
    res.status(500).json({
      success: false,
      message: "System is unhealthy",
      data: healthStatus
    });
  }
});

export default router;
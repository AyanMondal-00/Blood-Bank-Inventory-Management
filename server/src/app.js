import express from "express";
import cors from "cors";
import routes from "./routes/healthRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import middleware from "./middlewares/errorMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", routes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(middleware);
export default app;
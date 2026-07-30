import express from "express";
import cors from "cors";
import routes from "./routes/healthRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import middleware from "./middlewares/errorMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", routes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(middleware);
export default app;
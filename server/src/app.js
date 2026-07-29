import express from "express";
import cors from "cors";
import routes from "./routes/healthRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", routes);

export default app;
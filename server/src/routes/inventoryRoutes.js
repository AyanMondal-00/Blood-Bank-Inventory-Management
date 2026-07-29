import { Router } from "express";
import { getAllInventory } from "../controllers/inventoryController.js";

const router = Router();

router.get("/", getAllInventory);

export default router;
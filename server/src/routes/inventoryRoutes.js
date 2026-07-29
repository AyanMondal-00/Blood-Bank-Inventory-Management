import { Router } from "express";
import { getAllInventory } from "../controllers/inventoryController.js";
import { createInventory } from "../controllers/inventoryController.js";
import { validateCreateInventory } from "../middlewares/inventoryValidation.js";

const router = Router();

router.get("/", getAllInventory);
router.post("/", validateCreateInventory, createInventory);

export default router;
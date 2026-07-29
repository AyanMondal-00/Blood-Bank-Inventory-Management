import { Router } from "express";
import { getAllInventory } from "../controllers/inventoryController.js";
import { createInventory } from "../controllers/inventoryController.js";

const router = Router();

router.get("/", getAllInventory);
router.post("/", createInventory);

export default router;
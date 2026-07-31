import { Router } from "express";
import { getAllInventory, createInventory, issueBlood, updateBloodPrice } from "../controllers/inventoryController.js";
import { validateCreateInventory } from "../middlewares/inventoryValidation.js";


const router = Router();

router.get("/", getAllInventory);
router.post("/", validateCreateInventory, createInventory);
router.post("/issue", issueBlood);
router.put("/price", updateBloodPrice);
export default router;
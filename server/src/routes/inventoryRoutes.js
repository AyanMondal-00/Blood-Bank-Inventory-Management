import { Router } from "express";
import { 
  getAllInventory, 
  createInventory, 
  issueBlood, 
  updateBloodPrice, 
  getBloodPrices, 
  getExpiryMonitoring,
  getRevisedCharges,
  updateRevisedCharge
} from "../controllers/inventoryController.js";
import { validateCreateInventory } from "../middlewares/inventoryValidation.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", protect, getAllInventory);
router.get("/prices", protect, getBloodPrices);
router.get("/expiry-monitoring", protect, getExpiryMonitoring);
router.get("/revised-charges", protect, getRevisedCharges);
router.post("/", protect, validateCreateInventory, createInventory);
router.post("/issue", protect, issueBlood);
router.put("/price", protect, isAdmin, updateBloodPrice);
router.put("/revised-charge", protect, isAdmin, updateRevisedCharge);

export default router;
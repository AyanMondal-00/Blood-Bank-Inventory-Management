import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../middlewares/authValidation.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Private/Protected routes
router.get("/profile", protect, getProfile);

export default router;

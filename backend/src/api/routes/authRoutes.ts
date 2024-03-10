// In your router file
import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

router.post("/register", authController.userRegistration);
router.post("/login", authController.userLogin);

export default router;

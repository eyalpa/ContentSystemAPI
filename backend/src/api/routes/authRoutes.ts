// In your router file
import express from "express";
import { AuthController } from "../controllers/authController";
import upload from "../middleware/multerMiddleware";

const router = express.Router();
const authController = new AuthController();

router.post("/register",upload.single('picture'), authController.userRegistration);
router.post("/login", authController.userLogin);

export default router;

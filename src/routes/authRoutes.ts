import express from "express";
import { loginUser } from "../controllers/authController";

const router = express.Router();

// This route will handle the login and "Demo Login" button [cite: 69, 70]
router.post("/login", loginUser);

export default router;

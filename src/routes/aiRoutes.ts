import express from "express";
import { generateContent } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware"; // নিশ্চিত করুন ইউজার লগইন করা

const router = express.Router();

router.post("/generate", protect, generateContent);

export default router;

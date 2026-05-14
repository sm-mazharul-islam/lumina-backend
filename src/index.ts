import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";

// ১. এনভায়রনমেন্ট ভেরিয়েবল লোড করা (সবার আগে)
dotenv.config();

// ২. ডাটাবেস কানেকশন
connectDB();

const app = express();

/**
 * ৩. CORS কনফিগারেশন (লাইভ প্রোডাকশনের জন্য আপডেট করা)
 * এটি আপনার ভারসেল ফ্রন্টএন্ড এবং লোকালহোস্ট উভয়কেই অনুমতি দিবে।
 */
app.use(
  cors({
    origin: [
      "https://lumina-ai-ten-virid.vercel.app", // আপনার ফ্রন্টএন্ড লিংক
      "http://localhost:3000", // লোকাল ডেভেলপমেন্ট
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ৪. প্রি-ফ্লাইট (OPTIONS) রিকোয়েস্ট হ্যান্ডেল করা (CORS Error ফিক্স করার জন্য জরুরি)
app.options("*", cors());

// ৫. মিডলওয়্যার
app.use(express.json());

/**
 * ৬. রুট রাউট (Health Check)
 * এটি দিয়ে চেক করা যায় ব্যাকএন্ড লাইভ আছে কি না।
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Lumina AI Backend is Running Smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// ৭. এপিআই রাউটস
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

/**
 * ৮. গ্লোবাল এরর হ্যান্ডলার (সার্ভার ক্র্যাশ হওয়া থেকে বাঁচাবে)
 */
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// ৯. পোর্ট কনফিগারেশন
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Lumina Server is soaring on port ${PORT}`);
});

export default app; // Vercel বা অন্য হোস্টিংয়ের জন্য এক্সপোর্ট রাখা ভালো

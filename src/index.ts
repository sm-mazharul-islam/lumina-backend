import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";

// ১. এনভায়রনমেন্ট ভেরিয়েবল লোড করা
dotenv.config();

// ২. ডাটাবেস কানেকশন
connectDB();

const app = express();

/**
 * ৩. CORS কনফিগারেশন
 */
const allowedOrigins = [
  "https://lumina-ai-ten-virid.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/**
 * ৪. প্রি-ফ্লাইট (OPTIONS) রিকোয়েস্ট হ্যান্ডেল করা
 * রেজেক্স এরর এড়াতে আমরা সরাসরি মিডলওয়্যার ব্যবহার করছি।
 * এটি সব পাথের জন্য OPTIONS রিকোয়েস্ট এক্সেপ্ট করবে।
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// ৫. মিডলওয়্যার
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ৬. হেলথ চেক রাউট
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Lumina AI Backend is soaring on Vercel!",
    env_status: process.env.GEMINI_API_KEY ? "Keys Loaded" : "Keys Missing",
    timestamp: new Date().toISOString(),
  });
});

// ৭. এপিআই রাউটস
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

/**
 * ৮. হ্যান্ডেল ৪-০-৪ (Unknown Routes)
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Requested endpoint not found on Lumina Server.",
  });
});

/**
 * ৯. গ্লোবাল এরর হ্যান্ডলার
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server!",
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ১০. পোর্ট কনফিগারেশন (লোকাল রান করার জন্য)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on port ${PORT}`);
  });
}

// ১১. Vercel এর জন্য এক্সপোর্ট
export default app;

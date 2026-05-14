import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
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
 * ৩. CORS কনফিগারেশন
 * ভারসেল ডোমেইন এবং লোকালহোস্ট উভয়কেই অনুমতি দেওয়া হয়েছে।
 */
const allowedOrigins = [
  "https://lumina-ai-ten-virid.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * ৪. প্রি-ফ্লাইট (OPTIONS) রিকোয়েস্ট হ্যান্ডেল করা
 * '*' এরর এড়াতে আমরা কাস্টম মিডলওয়্যার ব্যবহার করছি।
 * এটি 'Missing parameter name' এররটি চিরতরে দূর করবে।
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
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
 * ৬. হেলথ চেক রাউট (Verification)
 * ব্রাউজারে এটি ওপেন করলে আপনি দেখতে পাবেন ভেরিয়েবল লোড হয়েছে কি না।
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Lumina AI Backend is soaring on Vercel!",
    db_status: process.env.MONGO_URI
      ? "Connected Config Found"
      : "Missing MONGO_URI",
    gemini_status: process.env.GEMINI_API_KEY
      ? "Key Found"
      : "Missing GEMINI_API_KEY",
    timestamp: new Date().toISOString(),
  });
});

// ৭. এপিআই রাউটস
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

/**
 * ৮. গ্লোবাল এরর হ্যান্ডলার
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server!",
  });
});

// ৯. Vercel এর জন্য এক্সপোর্ট (Serverless function হিসেবে কাজ করবে)
export default app;

// লোকালহোস্টে রান করার জন্য
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

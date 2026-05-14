import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
dotenv.config();
connectDB(); // Mandatory MongoDB connection

const app = express();
// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);
app.use(express.json());

// Root Route for verification
app.get("/", (req, res) => {
  res.send("Lumina AI Backend is Running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

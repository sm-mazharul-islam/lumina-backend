import mongoose from "mongoose";

// কানেকশন স্টেট ধরে রাখার জন্য একটি ভেরিয়েবল
let isConnected: number = 0;

export const connectDB = async () => {
  // ১. যদি আগে থেকেই কানেক্টেড থাকে, তবে নতুন করে কানেক্ট করার দরকার নেই
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  // ২. MONGO_URI চেক করা
  if (!process.env.MONGO_URI) {
    console.error("CRITICAL: MONGO_URI is missing from environment variables.");
    return;
  }

  try {
    console.log("=> Creating new database connection...");

    const db = await mongoose.connect(process.env.MONGO_URI, {
      // আধুনিক ড্রাইভারে এগুলো অটোমেটিক থাকে, তাও সেফটির জন্য রাখা ভালো
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState;
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error: any) {
    console.error("Database connection failed:", error.message);

    // সার্ভারলেস এনভায়রনমেন্টে process.exit(1) ব্যবহার না করাই ভালো
    // এটি করলে ভারসেল ফাংশন ক্র্যাশ করে এবং ৫০০ এরর দেয়
    throw new Error("Could not connect to database.");
  }
};

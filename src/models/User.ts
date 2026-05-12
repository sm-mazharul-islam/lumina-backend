import mongoose, { Schema, Document } from "mongoose";

// ১. ইন্টারফেস ডেফিনিশন (IUser)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "User" | "Admin" | "Manager";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Manager"],
      default: "User",
    },
  },
  {
    timestamps: true,
    // ২. ভার্চুয়াল আইডি কনফিগারেশন (ঐচ্ছিক)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ৩. অটোমেটিক ইনডেক্স সিঙ্ক (পুরনো ভুল ইনডেক্স রিমুভ করতে সাহায্য করবে)
UserSchema.set("autoIndex", true);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

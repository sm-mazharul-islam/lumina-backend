import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Admin", "Manager"],
      default: "User",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);

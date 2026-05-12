import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

/**
 * Generate a JWT token containing the user ID and role [cite: 15, 75]
 */
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

/**
 * Register a new user with a specific role [cite: 69, 75]
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user in MongoDB [cite: 18]
    const user = await User.create({
      name,
      email,
      password, // Note: Use bcrypt for hashing in real production [cite: 3]
      role: role || "User",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Login user and handle Demo Login functionality [cite: 69, 70]
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email [cite: 17, 18]
    const user = await User.findOne({ email });

    // Validate credentials [cite: 70]
    if (user && password === user.password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

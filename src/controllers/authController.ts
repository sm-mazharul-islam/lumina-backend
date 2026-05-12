import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // For production, you would compare hashed passwords here
  const user = await User.findOne({ email });

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
};

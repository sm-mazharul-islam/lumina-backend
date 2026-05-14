//!
import { Request, Response } from "express";
import axios from "axios";

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "API Key logic failed. Check your .env file." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // ৩. রেসপন্স ডাটা থেকে টেক্সট বের করা
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    return res.status(200).json({
      success: true,
      result: aiResponse,
    });
  } catch (error: any) {
    console.error(
      "Lumina AI Hub Error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Lumina AI could not process the request.",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

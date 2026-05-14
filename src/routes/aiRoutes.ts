import { Request, Response } from "express";
import axios from "axios";

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Server Configuration Error: API Key missing on live server.",
      });
    }

    // ভুল মডেল 'gemini-2.5-flash' পরিবর্তন করে 'gemini-1.5-flash' করা হয়েছে
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

    // রেসপন্স ডাটা সেফলি বের করা
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return res.status(200).json({
      success: true,
      result: aiResponse,
    });
  } catch (error: any) {
    console.error(
      "Lumina AI Hub Error:",
      error.response?.data || error.message,
    );

    // লাইভ সার্ভারে ডিবাগিংয়ের জন্য এরর মেসেজটি পাঠানো হচ্ছে
    return res.status(500).json({
      success: false,
      message: "Lumina AI could not process the request.",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

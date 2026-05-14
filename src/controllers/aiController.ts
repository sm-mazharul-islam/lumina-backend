import { Request, Response } from "express";
import axios from "axios";

/**
 * Lumina AI - Gemini Content Generation Controller
 * This controller handles interaction with Google Gemini 1.5 Flash API
 */
export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // ১. প্রম্পট আছে কি না চেক করা
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required to generate content.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ২. এপিআই কী চেক করা (লাইভ সার্ভারে এটি খুবই গুরুত্বপূর্ণ)
    if (!apiKey) {
      console.error(
        "CRITICAL: GEMINI_API_KEY is missing from environment variables.",
      );
      return res.status(500).json({
        success: false,
        message: "Server Configuration Error: Neural link API key missing.",
      });
    }

    // ৩. গুগল জেমিনি এপিআই ইউআরএল (মডেল: gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // ৪. এক্সিওস (Axios) এর মাধ্যমে জেমিনিকে রিকোয়েস্ট পাঠানো
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        // আপনি চাইলে এখানে generationConfig যোগ করতে পারেন (Optional)
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // ৩০ সেকেন্ড টাইমআউট (লাইভ সার্ভারের জন্য নিরাপদ)
      },
    );

    // ৫. রেসপন্স ডাটা থেকে টেক্সট বের করা (নিরাপদভাবে)
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return res.status(502).json({
        success: false,
        message: "Lumina AI received an empty response. Please try again.",
      });
    }

    // ৬. সফল রেসপন্স পাঠানো
    return res.status(200).json({
      success: true,
      result: aiResponse,
    });
  } catch (error: any) {
    // লাইভ সার্ভারের কনসোলে এরর লগ করা (ডিবাগিং সহজ হবে)
    console.error(
      "Lumina AI Hub Error Details:",
      error.response?.data || error.message,
    );

    // ৭. ফ্রন্টএন্ডে ইউজার-ফ্রেন্ডলি এরর মেসেজ পাঠানো
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error?.message || error.message;

    return res.status(statusCode).json({
      success: false,
      message: "Lumina AI could not process the request.",
      error: errorMessage,
    });
  }
};

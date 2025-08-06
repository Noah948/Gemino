import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// No need to import `response` from express — you already have `res` in the route handler

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("✅ Prompt received:", prompt);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =result.text || "No reply from Gemini API";

    console.log("✅ Gemini reply:", result.text);

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    res.status(500).json({ error: "Gemini API failed to return a response" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

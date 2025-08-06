// Import required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// Initialize Google Gemini AI with your API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST endpoint to handle prompt generation requests
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Send prompt to Gemini model and get the result
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Extract text reply from the result
    const reply = result.text || "No reply from Gemini API";

    // Send response back to the frontend
    res.json({ reply });
  } catch (error) {
    // Handle errors and send error response
    res.status(500).json({ error: "Gemini API failed to return a response" });
  }
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


import cors from "cors";
import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 4000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));
app.use(express.json());
app.use(express.static("public"));

app.post("/journal-prompt", async (req, res) => {
  try {
    const mood = req.body.mood;

    const allowedMoods = ["happy", "stressed", "curious", "sad", "calm"];

    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({
        error: "Please select a valid mood."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write one short, encouraging journal prompt for someone feeling ${mood}. Keep it gentle and non-judgmental.`
    });

    res.json({
      prompt: response.text
    });

  } catch (error) {
    console.error("Gemini Error:", error.message);

    res.status(500).json({
      error: "Could not generate a journal prompt."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

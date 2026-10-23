
import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 4001;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is missing from the .env file.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
  res.json({ message: "AI Study Buddy server is working!" });
});

app.post("/api/study", async (req, res) => {
  try {
    const { topic, task } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        error: "Please enter a topic."
      });
    }

    const instructions = {
      explain:
        "Explain the topic in simple English with a clear example.",
      quiz:
        "Create 5 multiple-choice questions with four options each. Include the correct answers.",
      notes:
        "Create concise revision notes with headings and bullet points."
    };

    if (!instructions[task]) {
      return res.status(400).json({
        error: "Invalid study task selected."
      });
    }

    console.log(`Generating ${task} for topic: ${topic}`);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `${instructions[task]}\n\nTopic: ${topic.trim()}`
    });

    const answer = response.text;

    if (!answer) {
      return res.status(502).json({
        error: "The AI returned an empty response. Please try again."
      });
    }

    return res.json({ result: answer });

  } catch (error) {
    console.error("Gemini API request failed:", error);

    return res.status(500).json({
      error: error.message || "An unexpected server error occurred."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Study Buddy is running at http://localhost:${PORT}`);
});

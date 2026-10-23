import "dotenv/config";
import express from "express"
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey })

const app = express()
const PORT = 4000;
app.use(express.json())
app.use(express.static("public"))
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working!" });
})
app.post("/api/ask", async (req, res) => {
    const question = req.body.question
    if (typeof question !== "string") {
        return res.status(400).json({
            error: "Question must be a string"
        });

    }

    if (question.trim() === "") {
        return res.status(400).json({
            error: "Please enter a question"
        });

    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: question,

        })

        res.json({ answer: response.text });
    } catch (error) {
        console.error("Gemini API error:", error)
        res.status(500).json({
            error: "Gemini API request failed"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

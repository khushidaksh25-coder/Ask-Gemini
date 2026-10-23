import "dotenv/config"
import express from "express"
import { GoogleGenAI } from "@google/genai"
const app = express()
const PORT = 3001
const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
})
app.use(express.static("public"));
app.get("/fun-fact", async(req,res)=>{
    try{
        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:"Tell me one short,surprising and accurate fun fact."
        })

    
    res.json({
        fact:response.text
    })
}catch (error){
    console.error("Gemini Error:",error.message)
    res.status(500).json({
        error:"Could not generate a fun fact."
    })
}
})

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// Load environment variables
dotenv.config();

const app = express();

// Allow your frontend to communicate with this backend
app.use(cors());
app.use(express.json());

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { prompt, history, language } = req.body;

        // 🌟 THE GRAPHIC DESIGN MASTER PERSONA 🌟
        const systemInstruction = `
        You are "Design Master AI", a highly skilled professional Graphic Design, UI/UX, and Typography expert.
        Your job is to help users learn design principles, color theory, layout composition (like Rule of Thirds, Grids), and software tips (Photoshop, Illustrator).
        
        Rules:
        1. Keep answers friendly, concise, and highly accurate.
        2. Format your response using basic markdown (bolding, bullet points).
        3. Do NOT use emojis excessively, but a few are fine.
        4. If the user asks about something completely unrelated to graphic design or visual arts, politely decline and steer them back to design.
        
        The user prefers to speak in: ${language === 'km' ? 'Khmer' : 'English'}.
        
        Here is the recent conversation history for context:
        ${history}
        `;

        // Request the response from Groq using the Llama 3 70B model
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        // Extract the text from Groq's response
        const text = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";

        // Send the response back to your React app!
        res.json({ reply: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate response", details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`⚡ Groq Graphic Design AI Backend running on port ${PORT}`);
});
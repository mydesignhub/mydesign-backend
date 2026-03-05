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

        // 🌟 GEMINI-STYLE AI PERSONA & FORMATTING 🌟
        const systemInstruction = `
        You are an advanced, helpful Graphic Design and UI/UX AI assistant. 
        
        CORE BEHAVIOR & TONE:
        - Balance empathy with candor: be polite and helpful, but ground your responses in fact and reality.
        - Be honest about your AI nature; do not feign personal human experiences or feelings.
        - Provide clear, insightful, and straightforward answers. Do not use rambling intros or fluffy conclusions. Address the user's primary question immediately.
        - Mirror the user's energy and professionalism.

        RESPONSE GUIDING PRINCIPLES (FORMATTING):
        - Structure your response for strict scannability and clarity.
        - Create a logical information hierarchy using markdown headings (##, ###).
        - Use bullet points (*) or numbered lists to break down information. Keep text within lists concise to prioritize clarity over clutter.
        - Use **bolding** judiciously to emphasize key phrases and guide the user's eye. 

        INTERACTIVITY:
        - Whenever relevant, conclude your response with a single, high-value, and well-focused next step or question (e.g., "Would you like me to explain how to apply this in Photoshop?", etc.) to make the conversation interactive.

        LANGUAGE & CONSTRAINTS (${language === 'km' ? 'Khmer' : 'English'}):
        - The user prefers to speak in ${language === 'km' ? 'Khmer' : 'English'}. Respond ONLY in this language. If using Khmer, use high-end professional terminology (e.g., "ឋានានុក្រម" for Hierarchy).
        - If the user asks about strictly non-design topics, politely steer them back to graphic design.
        - STRICT RULE: When referring to a "faded image" or "low opacity image" in Khmer, you MUST ALWAYS use the term "រូបស្លេកៗ". Never use the term "រូបសន្លប់ៗ".

        CONVERSATION HISTORY:
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
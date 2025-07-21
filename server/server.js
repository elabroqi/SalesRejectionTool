// --- GeminiKnights Project Server ---
// Express backend for AI sales objection tool

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 

const { GoogleGenAI } = require("@google/genai");
const fs = require("node:fs");
require('dotenv').config(); // Load environment variables from .env

// Initialize Gemini API client
const client = new GoogleGenAI({ apiKey: process.env.API_KEY});

// Example objection response structure for prompt
const exampleInteraction = {
  customerStatement: "I'm not sure if I need this right now.",
  conversationContext: "The customer was initially interested but expressed concern about timing.",
  techniques: ["Urgency", "Need", "Scarcity", "Time", "Assumptive Close"],
  expectedResponse: "I totally understand — that’s exactly why most of our clients decide to start now while the offer is still available!"
};

app.use(express.json()); // Parse JSON bodies

// --- API Endpoints ---

// Test endpoint
app.get('/api', (req, res) => {
    res.json({"users": ["1", "2", "3", "4"]});
});


// Simple add endpoint for demo
app.post('/api/add', (req, res) => {
    const { value } = req.body;
    console.log('Received from frontend:', value);
    res.json({ success: true, received: value });
});


// AI sales objection generation endpoint
app.post('/api/generate', async (req, res) => {
  const { customerStatement, conversationContext } = req.body;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an AI sales assistant helping a salesperson respond to a customer during a live call.
      
        Customer statement: "${customerStatement}"
        Conversation context: "${conversationContext}"

        Use these sales techniques: Urgency, Need, Scarcity, Time, Assumptive Close.
        Guidelines:
        1. Address concerns directly
        2. Build value and trust
        3. Be concise (1–2 sentences)
        4. Stay conversational and positive
        5. Show understanding

        Return only the response text. Example: "${exampleInteraction.expectedResponse}"`
    });

    res.json({ response: response.text.trim() });

  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate sales response" });
  }
});


// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
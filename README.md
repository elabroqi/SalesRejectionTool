# GeminiKnights: AI-Powered Sales Objection Handling Tool

This is an Express.js server that uses Google's Gemini 2.5 Flash model to generate intelligent, real-time sales responses. It helps sales reps handle common objections and keep calls flowing smoothly with short, persuasive replies tailored to each situation.

---

## How It Was Built

- ✅ Frontend: React + Vite + Tailwind CSS
- ✅ Backend: Node.js with Express
- ✅ AI Engine: Google Gemini 2.5 Flash

## Features

- 🎯 Instant Objection Handling: Tailored AI responses for common customer objections
- 💬 Greeting Recognition: Smart hardcoded replies to basic greetings
- 🧠 Sales Psychology: Techniques like Urgency, Scarcity, and Assumptive Close
- 🔁 Live Call Simulation: Mimics a real-time call dialogue
- ✅ Easy-to-integrate REST API for frontend clients

---

## Project Structure

```
SalesObjectionTool/
├── client/                  # React frontend with Vite + Tailwind
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Express backend with Gemini API
│   ├── server.js
│   ├── .env                 # Gemini API key
│   └── package.json
│
└── node_modules/            # Root-level dependencies

```

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/elabroqi/SalesRejectionTool.git
cd SalesRejectionTool
```

### 2. Backend Setup (`server/`)

```bash
cd server
npm install
npm start
```

### 3. Frontend Setup (`client/`)

```bash
cd ../client
npm install
npm start
```

### Challenges

- Structuring prompt inputs to consistently yield persuasive replies

## What's Next

- Support for multiple objection categories per industry
- User-configurable tone settings
- Database logging client info and transcripts

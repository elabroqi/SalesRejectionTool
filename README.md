# GeminiKnights: AI-Powered Sales Objection Handling Tool

This is an Express.js server that uses Google's Gemini 2.5 Flash model to generate intelligent, real-time sales responses. It helps sales reps handle common objections and keep calls flowing smoothly with short, persuasive replies tailored to each situation.

---

## Features

- ✅ Real-time AI-generated responses for sales objections
- ✅ Handles basic greetings like "Hello" or "Who are you?" with quick hardcoded replies
- ✅ Incorporates proven sales techniques (Urgency, Scarcity, Assumptive Close, etc.)
- ✅ Designed to simulate a real live call environment
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
│   ├── .env                 # Preloaded with Gemini API key
│   └── package.json
│
└── node_modules/            # Root-level dependencies

```

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/gemini-sales-objection-handler.git
cd gemini-sales-objection-handler
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

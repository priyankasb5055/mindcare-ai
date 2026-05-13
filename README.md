# MindCare AI

**Your Personal Mental Wellness Companion**

MindCare AI is a modern, full-stack MERN web application designed to help users track their moods, write daily journals, get AI-powered emotional support, and manage mental health activities—all through a secure, responsive, and beautifully designed interface.

## Features

- **User Authentication:** Secure JWT-based login and registration.
- **Mood Tracking:** Log your daily emotions with custom notes and tags.
- **Interactive Dashboard:** View mood trends and analytics via dynamic charts.
- **Journaling:** Write and save private journal entries securely.
- **AI Companion:** Chat with an empathetic AI (powered by Anthropic Claude) that offers support, mindfulness tips, and journaling prompts.
- **AI Insights:** Get personalized wellness insights based on your recent moods and journal entries.
- **Modern UI:** Calm, healing, and modern aesthetic using Tailwind CSS and Framer Motion.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router DOM
- React Hot Toast
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Anthropic API SDK

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas cluster
- Anthropic API Key

### Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure the variables:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The frontend `.env` is already configured, but verify it if needed (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## Folder Structure

- `/client`: React frontend code
- `/server`: Node.js Express backend code

## API Endpoints Overview

| Route | Method | Description | Access |
|-------|--------|-------------|--------|
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/auth/me` | GET | Get current user profile | Private |
| `/api/auth/profile` | PUT | Update user profile | Private |
| `/api/moods` | GET/POST | Get all moods / Create mood | Private |
| `/api/moods/stats` | GET | Get mood statistics | Private |
| `/api/moods/:id` | DELETE | Delete a mood entry | Private |
| `/api/journals` | GET/POST | Get all journals / Create | Private |
| `/api/journals/:id` | GET/PUT/DELETE | Manage specific journal | Private |
| `/api/ai/chat` | POST | Send message to AI Companion | Private |
| `/api/ai/analyze-mood` | POST | Get AI wellness insight | Private |
| `/api/ai/journal-prompt` | POST | Get AI journaling prompt | Private |

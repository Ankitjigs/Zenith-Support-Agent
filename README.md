# Zenith Support Agent - Spur Assessment

A robust, real-time customer support chat widget powered by a Node.js/TypeScript backend and a React frontend. The agent uses LLMs (Groq/Gemini) to provide contextual answers based on a defined knowledge base.

## 🌐 Live Demo & Deployment
**[View Live Deployment Here](zenith-support-agent.vercel.app)**  
*(Replace with your Vercel/Render URL)*

## 📸 Screenshots
![Chat Interface](<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6ed0be14-b5dd-4f4e-b09d-c21b8cdd816e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6cf19ff8-837b-4a36-a5f6-6453a9ec5777" />

)
*(Add a screenshot of the chat interface here)*

## ✨ Key Features
- **💬 Real-time Chat**: Smooth UI with auto-scrolling and typing indicators.
- **🤖 Multi-LLM Support**: Primary **Groq** integration for speed, with automatic **Gemini** fallback.
- **💾 Persistence**: Full conversation history saved to PostgreSQL; persists across reloads via Session ID.
- **🛡️ Robust Error Handling**: Graceful handling of network errors, API timeouts, and 404s.
- **📱 Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **🧠 Contextual Awareness**: Knowledge base injection for store-specific FAQs (Shipping, Returns, Hours).

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- API Keys for **Groq** (primary) and **Google Gemini** (fallback).

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env 
# Update .env with your credentials:
# DATABASE_URL="postgresql://user:pass@localhost:5432/spur_chat"
# GROQ_API_KEY="your_groq_key"
# GEMINI_API_KEY="your_gemini_key"
# FRONTEND_URL="http://localhost:5173"

# Setup Database
npx prisma generate
npx prisma push  # Or migrate dev

# Run Server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Run Client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the chat widget.

---

## 🏗️ Architecture Overview

The project follows a clean, modular architecture separating concerns between routing, business logic, and data access.

### Database Schema
We use a relational model to link sessions, conversations, and messages.

```mermaid
ERDiagram
    Session ||--|{ Conversation : initiates
    Conversation ||--|{ Message : contains
    
    Session {
        uuid id PK
        timestamp createdAt
    }
    
    Conversation {
        uuid id PK
        uuid sessionId FK
        string status
    }
    
    Message {
        uuid id PK
        uuid conversationId FK
        string sender "user | ai"
        text content
        timestamp createdAt
    }
```

### Backend (`/backend`)
Built with **Hono.js** for high performance and **TypeScript** for type safety.

- **`src/routes/`**: API endpoints. Handles HTTP requests, validation (Zod-like manual checks), and response formatting.
- **`src/services/`**: Business logic. Orchestrates data flow between the repository and LLM providers.
- **`src/repositories/`**: Data access. Wraps **Prisma** calls to abstract database operations.
- **`src/llm/`**: LLM integration layer.
    - **`provider.manager.ts`**: Implements the **Strategy Pattern** with fallback logic. If the primary provider (Groq) fails, it automatically switches to the secondary (Gemini).

### Frontend (`/frontend`)
Built with **React**, **Vite**, and **Tailwind CSS**.

- **`ChatWidget.jsx`**: Smart container managing state (messages, session, loading). Implements "lazy" session creation.
- **`MessagesContainer.jsx`**: Presentational component for the message list. Handles auto-scroll and hover-only scrollbar logic.
- **`src/api/`**: Centralized Axios instance for backend communication.

---

## 🧠 LLM Integration Notes

### Providers
1.  **Groq (Llama 3 / Mixtral)**: Selected as the **Primary** provider due to its extreme speed (Time-to-First-Token). Crucial for a chat experience.
2.  **Google Gemini (Flash)**: Selected as **Fallback**. Reliable and cost-effective backup if Groq is down or rate-limited.

### Prompting Strategy
The system prompt (defined in `knowledge-base.ts`) seeds the AI with a persona ("Zenith Electronics Support") and specific domain knowledge (Shipping, Returns, Hours).
- **Context Window**: We fetch the last N messages of the conversation history and append them to the prompt to maintain context.
- **Sanitization**: Inputs are sanitized to prevent basic injection attacks before reaching the LLM.

### Trade-offs & "If I had more time..."
- **Streaming**: Currently, the response assumes a full wait-and-return cycle. Implementation of Server-Sent Events (SSE) would allow for a "typing" effect that feels faster.
- **RAG**: The knowledge base is currently hardcoded in the system prompt. For a larger store, I would implement a Vector DB (pgvector) to retrieve relevant policy chunks dynamically.
- **WebSockets**: Polls/REST are used for simplicity. WebSockets would handle real-time user connections better at scale.

---

## 🛡️ Robustness Features
- **Strict Mode Compatibility**: Frontend handles React StrictMode's double-mounting gracefully without generating false 404 errors.
- **Silent Failures**: If backend history fetch fails for a new user, it degrades gracefully to an empty chat instead of crashing.
- **Input Validation**: Backend validates message length and presence before processing.

import { handle } from "hono/vercel";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import chatRoutes from "../src/routes/chat.routes.js";

// Initialize Hono App
// Note: We use base path '/api' to match Vercel's folder structure routing preference
const app = new Hono().basePath("/api");

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
// This mounts the chat routes at /api/chat
app.route("/chat", chatRoutes);

// Default Route
app.get("/", (c) => {
  return c.json({
    message: "Zenith Support Agent API (Vercel)",
    version: "1.0.0",
    environment: "production",
  });
});

// Vercel Config
export const config = {
  runtime: "nodejs", // Enforce Node.js runtime for Prisma compatibility
};

// Export Handler
export default handle(app);

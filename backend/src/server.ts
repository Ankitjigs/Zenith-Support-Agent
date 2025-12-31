import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.route("/api/chat", chatRoutes);

app.get("/", (c) => {
  return c.json({
    message: "Zenith Support Agent API",
    version: "1.0.0",
    endpoints: {
      health: "/api/chat/health",
      sendMessage: "POST /api/chat/message",
      getHistory: "GET /api/chat/history/:sessionId",
    },
  });
});

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

const port = parseInt(process.env.PORT || "3000");

export { app };
export default app;

// Only run the server if this file is the main entry point (Local Dev)
// In Vercel, this file is imported by api/index.ts, so this block won't run.
import { fileURLToPath } from "url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Starting server on port ${port}...`);
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`✓ Server running at http://localhost:${port}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
}

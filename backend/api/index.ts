import { handle } from "hono/vercel";
import { app } from "../src/server.js";

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Export Handler using the existing app (from server.ts)
// This ensures we use the exact same CORS and Middleware configuration as local dev.
export default handle(app);

import { handle } from "hono/vercel";
import { app } from "../src/server.js";

console.log("🔵 [API/INDEX] Module loaded (Vercel adapter)");

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Use Hono's native Vercel adapter
export default handle(app);

import { getRequestListener } from "@hono/node-server";
import { app } from "../src/server.js";

console.log("🔵 [API/INDEX] Module loaded");

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Export Handler using @hono/node-server
export default getRequestListener(app.fetch);

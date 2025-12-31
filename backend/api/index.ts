import { getRequestListener } from "@hono/node-server";
import { app } from "../src/server.js";

console.log("🔵 [API/INDEX] Module loaded");

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Export Handler using @hono/node-server
// This correctly converts Node.js IncomingMessage to Web Standard Request
const handler = getRequestListener(app.fetch);

// Wrap to add logging
export default async function wrappedHandler(req: any, res: any) {
  console.log("🔵 [API/INDEX] Request received:", req.method, req.url);
  return handler(req, res);
}

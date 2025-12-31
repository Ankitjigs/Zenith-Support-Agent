import { getRequestListener } from "@hono/node-server";
import { app } from "../src/server.js";

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Export Handler using @hono/node-server
// This correctly converts Node.js IncomingMessage to Web Standard Request
export default getRequestListener(app.fetch);

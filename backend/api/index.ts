import { app } from "../src/server.js";
import type { IncomingMessage, ServerResponse } from "node:http";

console.log("🔵 [API/INDEX] Custom Vercel adapter loaded");

// Vercel Config
export const config = {
  runtime: "nodejs",
};

// Custom adapter that properly reads Vercel request bodies
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  console.log("🔵 [ADAPTER] Request received:", req.method, req.url);

  try {
    // Read body manually from Vercel request
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);
    const bodyText = bodyBuffer.toString();

    console.log(
      "🔵 [ADAPTER] Body read successfully, length:",
      bodyText.length
    );

    // Create Web API Request for Hono
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const webRequest = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: bodyText || undefined,
    });

    console.log("🔵 [ADAPTER] Calling Hono app.fetch()");

    // Call Hono app
    const honoResponse = await app.fetch(webRequest);

    console.log(
      "🔵 [ADAPTER] Hono responded with status:",
      honoResponse.status
    );

    // Convert Web API Response to Node response
    res.statusCode = honoResponse.status;
    honoResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await honoResponse.text();
    res.end(responseBody);
  } catch (error: any) {
    console.error("🔵 [ADAPTER] Error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message }));
  }
}

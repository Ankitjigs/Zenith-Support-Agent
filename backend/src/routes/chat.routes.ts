import { Hono } from "hono";
import conversationService from "../services/conversation.service.js";
import providerManager from "../llm/provider.manager.js";
import {
  validateMessage,
  validateSessionId,
  sanitizeInput,
} from "../utils/validation.js";

const chat = new Hono();

chat.post("/message", async (c) => {
  try {
    const body = await c.req.json();
    const { message, sessionId } = body;

    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
      return c.json({ error: messageValidation.error }, 400);
    }

    let conversationId = sessionId;
    if (!sessionId) {
      // Create new conversation if no session ID provided
      conversationId = await conversationService.createConversation();
    } else {
      const sessionValidation = validateSessionId(sessionId);
      if (!sessionValidation.valid) {
        return c.json({ error: sessionValidation.error }, 400);
      }
    }

    //Input sanitization
    const sanitizedMessage = sanitizeInput(message);

    // Save user message
    console.log("[TRACE] Saving user message...");
    await conversationService.saveMessage(
      conversationId,
      "user",
      sanitizedMessage
    );
    console.log("[TRACE] User message saved");

    // Get conversation history for context
    console.log("[TRACE] Fetching conversation history...");
    const history = await conversationService.getFormattedHistory(
      conversationId
    );
    console.log("[TRACE] History fetched, messages:", history.length);

    // Generate AI response using provider manager
    console.log("[TRACE] Calling LLM provider...");
    const startTime = Date.now();
    const aiReply = await providerManager.generateReply(
      history,
      sanitizedMessage
    );
    const elapsed = Date.now() - startTime;
    console.log(`[TRACE] LLM responded in ${elapsed}ms`);

    // Save AI message
    console.log("[TRACE] Saving AI response...");
    await conversationService.saveMessage(conversationId, "ai", aiReply);
    console.log("[TRACE] AI response saved");

    return c.json({
      reply: aiReply,
      sessionId: conversationId,
    });
  } catch (error: any) {
    console.error("Chat message error:", error);
    console.error("Error stack:", error.stack);

    // Return user-friendly error message
    const errorMessage = error.message || "An unexpected error occurred";
    return c.json({ error: errorMessage, sessionId: null }, 500);
  }
});

chat.get("/history/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");

    const limit = parseInt(c.req.query("limit") || "50");
    const offset = parseInt(c.req.query("offset") || "0");

    const validation = validateSessionId(sessionId);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }

    const exists = await conversationService.conversationExists(sessionId);
    if (!exists) {
      return c.json({
        sessionId,
        messages: [],
        totalCount: 0,
        hasMore: false,
      });
    }

    const [messages, totalCount] = await Promise.all([
      conversationService.getConversationHistory(sessionId, limit, offset),
      conversationService.getMessageCount(sessionId),
    ]);

    return c.json({
      sessionId,
      messages: messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.createdAt,
      })),
      totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (error: any) {
    console.error("Get history error:", error);
    return c.json({ error: "Failed to retrieve conversation history" }, 500);
  }
});

chat.get("/health", (c) => {
  return c.json({ status: "ok", service: "chat-api" });
});

export default chat;

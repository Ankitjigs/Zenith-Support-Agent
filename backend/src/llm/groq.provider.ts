import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "../config/knowledge-base.js";
import { MAX_CONTEXT_MESSAGES } from "../utils/validation.js";
import { isServerless, withTimeout } from "../utils/timeout.js";
import type {
  ConversationHistory,
  ChatMessage,
} from "../types/conversation.types.js";

export class GroqProvider {
  private maxTokens: number = 300;
  private model: string = "openai/gpt-oss-120b"; // Faster model for better serverless performance
  private client: Groq | null = null;

  /**
   * Environment-aware client factory
   * - Dev: Cached client (faster, reuses connections)
   * - Serverless: Fresh client per call (prevents stale sockets)
   */
  private getClient(): Groq {
    if (!isServerless) {
      // Development: reuse client
      if (!this.client) {
        this.client = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
      }
      return this.client;
    }

    // Serverless: always fresh
    return new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateReply(
    conversationHistory: ConversationHistory,
    userMessage: string
  ): Promise<string> {
    try {
      const limitedHistory = conversationHistory.slice(-MAX_CONTEXT_MESSAGES);

      const messages: ChatMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...limitedHistory,
        { role: "user", content: userMessage },
      ];

      // Environment-aware timeout (15s serverless, 60s dev)
      const completion = await withTimeout(
        this.getClient().chat.completions.create({
          model: this.model,
          messages: messages,
          max_tokens: this.maxTokens,
          temperature: 0.7,
        })
      );

      const reply = completion.choices[0]?.message.content;

      if (!reply) {
        throw new Error("No response from Groq LLM");
      }

      return reply.trim();
    } catch (error: any) {
      console.error("Groq API Error:", error);

      if (error.message === "LLM_TIMEOUT") {
        console.warn(
          `Groq timeout (${isServerless ? "15s serverless" : "60s dev"})`
        );
        throw new Error("TIMEOUT");
      }

      if (error.status === 429) {
        throw new Error("RATE_LIMIT");
      }

      if (error.status === 401 || error.code === "invalid_api_key") {
        throw new Error("INVALID_API_KEY");
      }

      if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
        throw new Error("TIMEOUT");
      }

      throw new Error("SERVICE_ERROR");
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const completion = await withTimeout(
        this.getClient().chat.completions.create({
          model: this.model,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 5,
        }),
        10000 // Health check always 10s
      );
      return !!completion.choices[0];
    } catch (error) {
      console.error("Groq connection test failed:", error);
      return false;
    }
  }
}

export default new GroqProvider();

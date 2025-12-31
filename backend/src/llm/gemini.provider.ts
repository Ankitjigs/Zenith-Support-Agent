import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../config/knowledge-base.js";
import { MAX_CONTEXT_MESSAGES } from "../utils/validation.js";
import { ConversationHistory } from "../types/conversation.types.js";

export class GeminiProvider {
  private modelName: string;
  private client: GoogleGenAI | null = null;

  constructor() {
    this.modelName = "gemma-2-27b";
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return this.client;
  }

  async generateReply(
    conversationHistory: ConversationHistory,
    userMessage: string
  ): Promise<string> {
    try {
      const client = this.getClient();
      const limitedHistory = conversationHistory.slice(-MAX_CONTEXT_MESSAGES);

      const context = [
        SYSTEM_PROMPT,
        ...limitedHistory.map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        ),
      ].join("\n\n");

      const prompt = `${context}\n\nUser:${userMessage}\n\nAssistant:`;

      const response = await client.models.generateContent({
        model: this.modelName,
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      const reply = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error("No response content from Gemini");
      }

      return reply.trim();
    } catch (error: any) {
      console.error("Gemini API Error:", error);

      if (error.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again."
        );
      }

      if (error.status === 401 || error.message?.includes("API key")) {
        throw new Error("Configuration error. Please contact support.");
      }

      throw new Error(
        "Sorry, I encountered an error. Please try again in a moment."
      );
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.getClient().models.generateContent({
        model: this.modelName,
        contents: [
          {
            parts: [{ text: "test" }],
          },
        ],
      });
      return !!response.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error("Gemini connection test failed:", error);
      return false;
    }
  }
}

export default new GeminiProvider();

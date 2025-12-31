import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../config/knowledge-base";
import { MAX_CONTEXT_MESSAGES } from "../utils/validation";
import { ConversationHistory } from "../types/conversation.types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class GeminiProvider {
    private modelName: string;

    constructor() {
        this.modelName = "gemma-3-27b";
    }

    async generateReply(
        conversationHistory: ConversationHistory,
        userMessage: string
    ): Promise<string> {
        try {
            const limitedHistory = conversationHistory.slice(-MAX_CONTEXT_MESSAGES);

            const context = [
                SYSTEM_PROMPT,
                ...limitedHistory.map(
                    (msg) =>
                        `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
                ),
            ].join("\n\n");

            const prompt = `${context}\n\nUser:${userMessage}\n\nAssistant:`;

            const response = await ai.models.generateContent({
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
            const response = await ai.models.generateContent({
                model: this.modelName,
                contents: [{
                    parts: [{ text: 'test' }]
                }]
            });
            return !!response.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            console.error('Gemini connection test failed:', error);
            return false;
        }
    }
}

export default new GeminiProvider();

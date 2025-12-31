import groqProvider from "./groq.provider.js";
import geminiProvider from "./gemini.provider.js";
import type { ConversationHistory } from "../types/conversation.types.js";

export class providerManager {
  private primaryProvider = groqProvider;
  private fallbackProvider = geminiProvider;

  async generateReply(
    conversationHistory: ConversationHistory,
    userMessage: string
  ): Promise<string> {
    try {
      console.log("Using primary provider: Groq");
      const reply = await this.primaryProvider.generateReply(
        conversationHistory,
        userMessage
      );

      return reply;
    } catch (primaryError: any) {
      console.warn("Primary provider (Groq) failed:", primaryError.message);

      try {
        console.log("Falling back to: Gemini");
        const reply = await this.fallbackProvider.generateReply(
          conversationHistory,
          userMessage
        );
        return reply;
      } catch (fallbackError: any) {
        console.error(
          "Fallback provider (Gemini) also failed:",
          fallbackError.message
        );

        throw new Error(
          "Our AI assistant is temporarily unavailable. Please try again in a moment."
        );
      }
    }
  }

  async testConnections(): Promise<{
    primary: boolean;
    fallback: boolean;
  }> {
    const [primary, fallback] = await Promise.all([
      this.primaryProvider.testConnection(),
      this.fallbackProvider.testConnection(),
    ]);

    return { primary, fallback };
  }

  swapProviders() {
    const temp = this.primaryProvider;
    this.primaryProvider = this.fallbackProvider as any;
    this.fallbackProvider = temp as any;
    console.log("🔀 Swapped primary and fallback providers");
  }
}

export default new providerManager();

import conversationRepository from "../repositories/conversation.repository";
import type { Message } from "../models/database";
import { ConversationHistory } from "../types/conversation.types";

export class ConversationService {
  async createConversation(): Promise<string> {
    return await conversationRepository.create();
  }

  async conversationExists(conversationId: string): Promise<boolean> {
    const conversation = await conversationRepository.findById(conversationId);
    return !!conversation;
  }

  async saveMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
  ): Promise<Message> {
    const exists = await this.conversationExists(conversationId);

    if (!exists) {
      await conversationRepository.create(conversationId);
    }

    return await conversationRepository.createMessage(
      conversationId,
      sender,
      text
    );
  }

  async getConversationHistory(
    conversationId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Message[]> {
    return await conversationRepository.findMessagesByConversationId(
      conversationId,
      limit,
      offset
    );
  }

  async getMessageCount(conversationId:string): Promise<number>{
    return await conversationRepository.getMessageCount(conversationId);
  }

  async getFormattedHistory(conversationId: string, limit: number = 10):Promise<ConversationHistory>{
        const messages = await this.getConversationHistory(conversationId, limit);
        
        return messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
        }))
  }


  async deleteOldConversation(daysOld:number = 30):Promise<number>{
    return await conversationRepository.deleteOlderThan(daysOld);
  }
}

export default new ConversationService();

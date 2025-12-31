import prisma from "../models/database";
import type { Message } from "../models/database";

export class ConversationRepository {
  async create(id?: string): Promise<string> {
    const conversation = await prisma.conversation.create({
      data: id ? { id } : {},
    });

    return conversation.id;
  }

  async findById(id: string): Promise<{ id: string } | null> {
    return await prisma.conversation.findUnique({
      where: { id },
    });
  }

  async createMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
  ): Promise<Message> {
    return await prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }

  async findMessagesByConversationId(
    conversationId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return messages.reverse();
  }

  async getMessageCount(conversationId: string): Promise<number> {
    return await prisma.message.count({
      where: { conversationId },
    });
  }

  async deleteOlderThan(daysOld: number): Promise<number> {
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - daysOld);

    const result = await prisma.conversation.deleteMany({
      where: {
        createdAt: {
          lt: cutOffDate,
        },
      },
    });

    return result.count;
  }
}

export default new ConversationRepository();

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

const getPrisma = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }

  // Standard Prisma Client (Native Engine) is more robust for Node.js
  prismaInstance = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prismaInstance;

  return prismaInstance;
};

// Export a Proxy that forwards all calls to the lazy instance
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    return (getPrisma() as any)[prop];
  },
});

process.on("beforeExit", async () => {
  if (prismaInstance) await prismaInstance.$disconnect();
});

export default prisma;

export type { Conversation, Message } from "@prisma/client";

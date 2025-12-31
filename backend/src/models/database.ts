import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

let prismaInstance: PrismaClient | null = null;
let poolInstance: Pool | null = null;

const getPrisma = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    poolInstance = globalForPrisma.pool;
    return prismaInstance;
  }

  // Initialize pg pool for adapter with timeout configuration
  poolInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Limit pool size for serverless
    connectionTimeoutMillis: 10000, // 10 second timeout
    idleTimeoutMillis: 30000,
    allowExitOnIdle: true, // Important for serverless
  });

  const adapter = new PrismaPg(poolInstance);

  // Prisma Client with adapter (required for edge-compatible client engine)
  prismaInstance = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
    globalForPrisma.pool = poolInstance;
  }

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
  if (poolInstance) await poolInstance.end();
});

export default prisma;

export type { Conversation, Message } from "@prisma/client";

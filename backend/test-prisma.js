import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

console.log('Testing Prisma Client...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

try {
    const adapter = new PrismaPg({
        url: process.env.DATABASE_URL,
    });

    const prisma = new PrismaClient({
        log: ['error'],
        adapter: adapter,
    });
await prisma.$connect();
    console.log('✓ Successfully connected to database!');
    await prisma.$disconnect();
} catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Create a standard Prisma client for NextAuth
const standardPrismaClientSingleton = () => {
  return new PrismaClient();
};

// Create an accelerated Prisma client for your app
const acceleratedPrismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare global {
  var prisma: ReturnType<typeof standardPrismaClientSingleton> | undefined;
  var prismaAccelerate: ReturnType<typeof acceleratedPrismaClientSingleton> | undefined;
}

// Export both clients
export const prisma = globalThis.prisma ?? standardPrismaClientSingleton();
export const prismaAccelerate = globalThis.prismaAccelerate ?? acceleratedPrismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
  globalThis.prismaAccelerate = prismaAccelerate;
}

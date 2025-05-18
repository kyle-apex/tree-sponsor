import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
console.log('ts global.prisma', !!global.prisma);
export const prisma =
  global.prisma ||
  new PrismaClient({
    //log: ['query'],
  });

export { Prisma } from '@prisma/client';

//if (process.env.NODE_ENV !== 'production')
global.prisma = prisma;

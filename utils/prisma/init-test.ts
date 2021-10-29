import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
global.prisma = prisma;
export default prisma;

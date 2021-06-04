import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUser = async (id: number, attributes: Record<string, unknown>): Promise<void> => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: attributes,
  });
};

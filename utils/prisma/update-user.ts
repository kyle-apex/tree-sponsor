import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUser = async (id: number, attributes: Record<string, unknown>): Promise<User> => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: attributes,
  });
};

import { User } from '@prisma/client';
import { prisma } from 'utils/prisma/init';
console.log('primsa in updateUser', prisma);

export const updateUser = async (id: number, attributes: Record<string, unknown>): Promise<User> => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: attributes,
  });
};

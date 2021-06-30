import { PrismaClient } from '@prisma/client';
import { AccessType } from './AccessType';

const prisma = new PrismaClient();

export default async function hasAccess(userId: number, accessType: AccessType): Promise<boolean> {
  const userWithValidRoles = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: { roles: { where: { [accessType]: true } } },
  });
  return userWithValidRoles?.roles?.length > 0;
}

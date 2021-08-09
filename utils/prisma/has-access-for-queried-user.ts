import { PrismaClient, User, UserWhereInput } from '@prisma/client';
import { AccessType } from 'utils/auth/AccessType';

const prisma = new PrismaClient();

export const hasAccessForQueriedUser = async (query: UserWhereInput, accessType: AccessType): Promise<boolean> => {
  const userWithValidRoles = await prisma.user.findFirst({
    where: query,
    include: { roles: { where: { [accessType]: true } } },
  });
  return userWithValidRoles?.roles?.length > 0;
};

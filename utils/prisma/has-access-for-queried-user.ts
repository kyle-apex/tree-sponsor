import { AccessType } from 'utils/auth/AccessType';
import { prisma } from 'utils/prisma/init';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserWhereInput } from '@prisma/client';

export const hasAccessForQueriedUser = async (query: UserWhereInput, accessType: AccessType): Promise<boolean> => {
  const userWithValidRoles = await prisma.user.findFirst({
    where: query,
    include: { roles: { where: { [accessType]: true } } },
  });
  return userWithValidRoles?.roles?.length > 0;
};

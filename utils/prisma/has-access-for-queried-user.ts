import { AccessType } from 'utils/auth/AccessType';
import { prisma } from 'utils/prisma/init';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserWhereInput, RoleWhereInput } from '@prisma/client';
import { PartialUser } from 'interfaces';

export const hasAccessForQueriedUser = async (query: UserWhereInput, accessType: AccessType | AccessType[]): Promise<boolean> => {
  const filter: UserWhereInput = {
    where: query,
    include: { roles: {} },
  };

  let rolesWhereFilter: RoleWhereInput = {};

  if (typeof accessType === 'string') rolesWhereFilter = { [accessType]: true };
  else {
    rolesWhereFilter.OR = accessType.map(accessType => {
      return {
        [accessType]: true,
      };
    });
  }
  filter.include.roles.where = rolesWhereFilter;

  const userWithValidRoles = (await prisma.user.findFirst(filter)) as PartialUser;
  return userWithValidRoles?.roles?.length > 0;
};

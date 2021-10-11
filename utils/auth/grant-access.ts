import { NextApiRequest } from 'next';
import { AccessType } from './AccessType';
import { isCurrentUserAuthorized } from './is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function grantAccess(userId: number, accessType: AccessType, req?: NextApiRequest): Promise<void> {
  if (!(await isCurrentUserAuthorized('hasAuthManagement', req))) return;

  let role = await prisma.role.findFirst({
    where: {
      name: accessType,
    },
  });

  if (!role) {
    role = await prisma.role.create({ data: { name: accessType } });
  }
  console.log('role', role);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roles: {
        connect: { id: role.id },
      },
    },
  });
}

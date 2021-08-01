import { PrismaClient } from '@prisma/client';
import { NextApiRequest } from 'next';
import { AccessType } from './AccessType';
import { isCurrentUserAuthorized } from './is-current-user-authorized';
const prisma = new PrismaClient();

export default async function removeAccess(userId: number, accessType: AccessType, req?: NextApiRequest): Promise<void> {
  if (!(await isCurrentUserAuthorized('hasAuthManagement', req))) return;

  const role = await prisma.role.findFirst({
    where: {
      name: accessType,
    },
  });
  console.log('role', role);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roles: {
        disconnect: { id: role.id },
      },
    },
  });
}

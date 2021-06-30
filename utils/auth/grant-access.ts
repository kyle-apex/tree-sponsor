import { PrismaClient } from '@prisma/client';
import { AccessType } from './AccessType';
import { isCurrentUserAuthorized } from './is-current-user-authorized';
const prisma = new PrismaClient();

export default async function grantAccess(userId: number, accessType: AccessType): Promise<void> {
  if (!(await isCurrentUserAuthorized('hasAuthManagement'))) return;

  const role = await prisma.role.findFirst({
    where: {
      [accessType]: true,
    },
  });

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

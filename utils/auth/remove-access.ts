import { PrismaClient } from '@prisma/client';
import { isCurrentUserAuthorized } from './is-current-user-authorized';
const prisma = new PrismaClient();

export default async function grantAccess(userId: number, roleId: number): Promise<void> {
  if (!(await isCurrentUserAuthorized('hasAuthManagement'))) return;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roles: {
        disconnect: { id: roleId },
      },
    },
  });
}

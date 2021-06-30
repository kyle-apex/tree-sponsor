import { PrismaClient } from '@prisma/client';
import { isCurrentUserAdmin } from './is-current-user-admin';
const prisma = new PrismaClient();

export default async function grantAccess(userId: number, roleId: number): Promise<void> {
  if (!(await isCurrentUserAdmin())) return;

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

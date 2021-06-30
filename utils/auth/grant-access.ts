import { PrismaClient } from '@prisma/client';
import { isCurrentUserAdmin } from './is-current-user-admin';
const prisma = new PrismaClient();

export default async function grantAccess(userId: number, accessType: string): Promise<void> {
  if (!(await isCurrentUserAdmin())) return;

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

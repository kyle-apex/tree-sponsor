import { prisma } from 'utils/prisma/init';

export default async function isDuplicateProfilePath(id: number, profilePath: string): Promise<boolean> {
  const user = await prisma.user.findFirst({ where: { id: { not: id }, profilePath } });

  return user?.id ? true : false;
}

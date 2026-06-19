import { PrismaClient } from '@prisma/client';
import { PartialUser } from 'interfaces';
import { generateProfilePath } from './generate-profile-path';

export async function generateUniqueProfilePath(user: PartialUser, prismaClient: PrismaClient): Promise<string> {
  const base = generateProfilePath(user);

  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const where = user.id ? { id: { not: user.id }, profilePath: candidate } : { profilePath: candidate };
    const conflict = await prismaClient.user.findFirst({ where });
    if (!conflict) return candidate;
  }

  return `${base}-${Date.now()}`;
}

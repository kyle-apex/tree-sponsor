import { Prisma } from 'utils/prisma/init';

export function getTreeIncludeFilter(userId?: number): Prisma.TreeInclude {
  return {
    images: { orderBy: { sequence: 'asc' } },
    species: { select: { id: true, commonName: true, height: true, growthRate: true, longevity: true, isNative: true } },
    speciesQuizResponses: { where: { userId: userId } },
  };
}

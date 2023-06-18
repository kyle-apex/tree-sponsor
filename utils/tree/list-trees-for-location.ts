import { PartialTree } from 'interfaces';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { Prisma } from 'utils/prisma/init';

export default async function listTreesForCoordinate(
  latitude: number,
  longitude: number,
  distance?: number,
  userId?: number,
): Promise<PartialTree[]> {
  if (!latitude || !longitude) return [];
  const whereFilter = getLocationFilterByDistance(latitude, longitude, distance || 500);
  const includeFilter: Prisma.TreeInclude = {
    images: { orderBy: { sequence: 'asc' } },
    species: { select: { id: true, commonName: true, height: true, growthRate: true, longevity: true, isNative: true } },
    speciesQuizResponses: { where: { userId: userId } },
  };
  whereFilter.speciesId = { not: null };

  if (!userId) delete includeFilter.speciesQuizResponses;

  return (await prisma.tree.findMany({
    where: whereFilter,
    include: includeFilter,
  })) as PartialTree[];
}

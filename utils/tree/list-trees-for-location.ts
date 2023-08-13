import { PartialTree } from 'interfaces';
import { getTreeIncludeFilter } from 'utils/prisma/common-filters';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { Prisma, prisma } from 'utils/prisma/init';

export default async function listTreesForCoordinate(
  latitude: number,
  longitude: number,
  distance?: number,
  userId?: number,
): Promise<PartialTree[]> {
  if (!latitude || !longitude) return [];
  const whereFilter = getLocationFilterByDistance(latitude, longitude, distance || 500);
  const includeFilter = getTreeIncludeFilter(userId);
  whereFilter.speciesId = { not: null };

  if (!userId) delete includeFilter.speciesQuizResponses;

  return (await prisma.tree.findMany({
    where: whereFilter,
    include: includeFilter,
  })) as PartialTree[];
}

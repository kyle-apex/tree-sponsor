import { PartialTree } from 'interfaces';
import { getTreeIncludeFilter } from 'utils/prisma/common-filters';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { Prisma, prisma } from 'utils/prisma/init';
import listTreesForCoordinate from './list-trees-for-location';

export default async function listTreesForEvent(eventId: number, userId?: number): Promise<PartialTree[]> {
  const event = await prisma.event.findFirst({
    where: { id: eventId },
    include: { location: {}, trees: { include: { tree: { include: getTreeIncludeFilter(userId) } }, orderBy: { sequence: 'asc' } } },
  });

  let trees: PartialTree[] = [];

  if (event.hasSpecificTrees) {
    trees = event?.trees?.map(treeToEvent => treeToEvent.tree);
  } else if (event.location?.latitude) {
    trees = await listTreesForCoordinate(Number(event.location.latitude), Number(event.location.longitude), 500, userId);
  }
  return trees;
}

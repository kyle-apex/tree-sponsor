import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, Prisma } from 'utils/prisma/init';
import { PartialTree } from 'interfaces';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const eventId = Number(req.query.id);
    const email = req.query.email + '';

    const event = await prisma.event.findFirst({ where: { id: eventId }, include: { location: {} } });

    const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });

    let trees: PartialTree[] = [];

    if (event.location?.latitude) {
      const whereFilter = getLocationFilterByDistance(Number(event.location.latitude), Number(event.location.longitude), 500);
      const includeFilter: Prisma.TreeInclude = {
        images: { orderBy: { sequence: 'asc' } },
        species: { select: { id: true, commonName: true, height: true, growthRate: true, longevity: true, isNative: true } },
        speciesQuizResponses: { where: { userId: user?.id } },
      };
      whereFilter.speciesId = { not: null };

      if (!user?.id) delete includeFilter.speciesQuizResponses;

      trees = (await prisma.tree.findMany({
        where: whereFilter,
        include: includeFilter,
      })) as PartialTree[];
    }
    res.status(200).json(trees);
  }
}

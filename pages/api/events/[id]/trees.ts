import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, Prisma } from 'utils/prisma/init';
import { PartialTree } from 'interfaces';
import listTreesForCoordinate from 'utils/tree/list-trees-for-location';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const eventId = Number(req.query.id);
    const email = req.query.email + '';

    const event = await prisma.event.findFirst({ where: { id: eventId }, include: { location: {} } });

    const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });

    let trees: PartialTree[] = [];

    if (event.location?.latitude) {
      trees = await listTreesForCoordinate(Number(event.location.latitude), Number(event.location.longitude), 500, user?.id);
    }
    res.status(200).json(trees);
  }
}

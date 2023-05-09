import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialTree } from 'interfaces';
import { v4 as uuidv4 } from 'uuid';

import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { Tree } from '@prisma/client';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const id = Number(req.query.id);
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
        species: { select: { id: true, commonName: true, height: true, growthRate: true, longevity: true, isInTexas: true } },
        speciesQuizResponses: { where: { userId: user?.id } },
      };
      whereFilter.speciesId = { not: null };

      if (!user?.id) delete includeFilter.speciesQuizResponses;

      trees = (await prisma.tree.findMany({
        where: whereFilter,
        include: includeFilter,
      })) as PartialTree[];
    }
    /*
    const result = await prisma.event.findFirst({
      where: { id: id },
      include: {
        location: {
          include: {
            trees: {
              include: { sponsorships: {}, species: {} },
            },
          },
        },
      },
    });*/
    res.status(200).json(trees);
  }
}

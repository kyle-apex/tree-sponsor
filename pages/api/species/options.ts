import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query: Prisma.SpeciesFindManyArgs = {
      orderBy: [{ searchPriority: 'desc' }, { commonName: 'asc' }],
      select: { commonName: true, name: true, id: true },

      take: 100,
    };

    if (req.query.search) {
      query.where = { OR: [{ commonName: { contains: req.query.search as string } }, { name: { contains: req.query.search as string } }] };
    }

    const species = await prisma.species.findMany(query);

    res.status(200).json(species);
  }
}

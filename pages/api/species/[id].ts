import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query: Prisma.SpeciesFindFirstArgs = {
      select: { commonName: true, name: true, id: true },
      where: { id: Number(req.query.id) },
    };

    const species = await prisma.species.findFirst(query);

    res.status(200).json(species);
  }
}

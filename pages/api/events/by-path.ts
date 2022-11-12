import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const path = req.query.path as string;

    const event = await prisma.event.findFirst({
      where: { path },
      include: {
        categories: { include: { trees: {} } },
        location: {},
      },
    });

    res.status(200).json(event);
  }
}

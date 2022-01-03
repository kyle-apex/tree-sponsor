import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const path = req.query.path as string;

    const category = await prisma.category.findFirst({
      where: { path },
      include: {
        events: {},
        trees: {},
      },
    });

    res.status(200).json(category);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const comment = await prisma.comment.create({ data: req.body });
    res.status(200).json(comment);
  }
}

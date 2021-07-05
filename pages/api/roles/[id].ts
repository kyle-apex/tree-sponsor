import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'POST') {
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.status(200).json(result);
  }
}

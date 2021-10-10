import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sponsorships = await prisma.sponsorship.findMany({
      where: { reviewStatus: { notIn: ['Draft', 'Rejected'] } },
      include: { tree: {}, user: { select: { name: true, image: true } } },
      orderBy: { startDate: 'desc' },
      take: 3,
    });
    res.status(200).json(sponsorships);
  }
}

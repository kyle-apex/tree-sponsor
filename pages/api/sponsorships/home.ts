import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';

//SponsorshipWhereInput
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const whereClause: Prisma.SponsorshipWhereInput = { reviewStatus: { notIn: ['Draft', 'Rejected'] } };

    if (process.env.FEATURED_SPONSORSHIP_IDS) {
      const ids = process.env.FEATURED_SPONSORSHIP_IDS.trim()
        .split(',')
        .map(id => Number(id.trim()));

      if (ids.length > 2) {
        whereClause.id = { in: ids };
      }
    }

    const sponsorships = await prisma.sponsorship.findMany({
      where: whereClause,
      include: { tree: {}, user: { select: { name: true, image: true, profilePath: true } } },
      orderBy: [{ description: 'desc' }, { startDate: 'desc' }],
      take: 3,
    });
    res.status(200).json(sponsorships);
  }
}

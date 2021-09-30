import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let sponsorships = await prisma.sponsorship.findMany({
      select: {
        tree: {
          select: { latitude: true, longitude: true, id: true },
        },
        title: true,
        description: true,
        pictureUrl: true,
        startDate: true,
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    sponsorships.filter(sponsorship => sponsorship.tree?.latitude);
    /*sponsorships.forEach(sponsorship => {
      sponsorship.tree.latitude = new Decimal(sponsorship.tree.latitude).toNumber();
    });*/
    sponsorships = parseResponseDateStrings(sponsorships);
    res.status(200).json(sponsorships);
  }
}

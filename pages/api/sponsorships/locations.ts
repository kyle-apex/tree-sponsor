import { NextApiRequest, NextApiResponse } from 'next';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sponsorships = await prisma.sponsorship.findMany({
      where: { reviewStatus: { notIn: ['Draft', 'Rejected'] }, isPrivate: false, isPrivateLocation: false },
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
    const result = parseResponseDateStrings(sponsorships);
    res.status(200).json(result);
  }
}

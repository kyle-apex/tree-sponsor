import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const profilePath = req.query.profilePath as string;

    const user = await prisma.user.findFirst({
      where: { profilePath },
      include: { sponsorships: { include: { tree: {} } }, roles: {} },
    });

    console.log('user', user);

    if (!user) throwError(res, 'Profile not found');

    /* const sponsorships = await prisma.sponsorship.findMany({
      where: { userId: user.id },
      include: { tree: {}, user: { select: { name: true, image: true } } },
      orderBy: { startDate: 'desc' },
    });*/
    res.status(200).json(user);
  }
}

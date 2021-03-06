import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'GET') {
    const sponsorships = await prisma.sponsorship.findMany({
      where: { userId: userId },
      include: { tree: {}, user: {} },
      orderBy: { startDate: 'desc' },
    });
    res.status(200).json(sponsorships);
  } /*else if (req.method === 'POST') {
    const role = await prisma.role.create({ data: req.body });
    res.status(200).json(role);
  }*/
}

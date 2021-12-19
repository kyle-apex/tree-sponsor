import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let session, userId;

  console.log('req', req.method);

  if (req.method !== 'GET') {
    session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    userId = session.user.id;
  }

  const id = Number(req.query.id);

  if (!id) return throwError(res, 'No sponsorship specified');

  if (req.method === 'GET') {
    const sponsorships = await prisma.sponsorship.findFirst({
      where: { id: id },
      include: {
        tree: {},
        user: { select: { name: true, image: true, profilePath: true } },
        comments: { include: { user: { select: { name: true, displayName: true, image: true, profilePath: true } } } },
      },
      orderBy: { startDate: 'desc' },
    });
    res.status(200).json(sponsorships);
  } else if (req.method === 'DELETE') {
    const sponsorship = await prisma.sponsorship.findFirst({ where: { userId: userId, id: id } });

    if (!sponsorship) throwError(res, 'You are not authorized to delete this sponsorship');

    await prisma.sponsorship.delete({ where: { id: id } });

    res.json({ count: 1 });
  } else if (req.method === 'PATCH') {
    const result = await prisma.sponsorship.update({ where: { id }, data: req.body });
    res.status(200).json(result);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Sponsorship } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let session, userId;

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
      include: { tree: {}, user: { select: { name: true, image: true } } },
      orderBy: { startDate: 'desc' },
    });
    res.status(200).json(sponsorships);
  } else if (req.method === 'DELETE') {
    const sponsorship = await prisma.sponsorship.findFirst({ where: { userId: userId, id: id } });

    if (!sponsorship) throwError(res, 'You are not authorized to delete this sponsorship');

    await prisma.sponsorship.delete({ where: { id: id } });

    res.json({ count: 1 });
  }
}

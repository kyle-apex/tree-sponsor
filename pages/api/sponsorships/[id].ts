import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Sponsorship } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('id');
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const id = Number(req.query.id);

  if (!id) return throwError(res, 'No sponsorship specified');

  const userId = session.user.id;

  if (req.method === 'DELETE') {
    const sponsorship = await prisma.sponsorship.findFirst({ where: { userId: userId, id: id } });

    if (!sponsorship) throwError(res, 'You are not authorized to delete this sponsorship');

    await prisma.sponsorship.delete({ where: { id: id } });

    res.json({ count: 1 });
  }
}

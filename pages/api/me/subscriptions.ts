import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'GET') {
    const items = await prisma.subscriptionWithDetails.findMany({
      where: { userId: userId },
    });

    for (const item of items || []) {
      item.expirationDate = item.lastPaymentDate;
      item.expirationDate.setFullYear(item.expirationDate.getFullYear() + 1);
    }

    res.status(200).json(items);
  } /*else if (req.method === 'POST') {
    const role = await prisma.role.create({ data: req.body });
    res.status(200).json(role);
  }*/
}

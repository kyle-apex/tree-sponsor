import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, Prisma } from 'utils/prisma/init';
import { PartialTree } from 'interfaces';
import listTreesForEvent from 'utils/tree/list-trees-for-event';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const eventId = Number(req.query.id);
    const email = req.query.email + '';

    const user = await getUserByEmail(email, { select: { id: true } });
    const trees: PartialTree[] = await listTreesForEvent(eventId, user?.id);

    res.status(200).json(trees);
  }
}

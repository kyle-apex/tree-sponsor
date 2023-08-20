import { PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import listTreesForCoordinate from 'utils/tree/list-trees-for-location';
import { prisma } from 'utils/prisma/init';
import listTreesForEvent from 'utils/tree/list-trees-for-event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (req.method === 'GET') {
    let userId = session?.user?.id;
    const eventId = Number(req.query.eventId);
    const email = String(req.query.email);

    if (email && !userId) {
      const user = (await prisma.user.findFirst({ where: { email } })) as PartialUser;
      userId = user?.id;
    }

    const trees = await listTreesForEvent(eventId, userId);
    res.status(200).json(trees);
  }
}

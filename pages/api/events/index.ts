import { PartialEvent } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const events = await prisma.event.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(events);
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    const event = req.body as PartialEvent;

    event.userId = session.user.id;

    const newEvent = await prisma.event.create({ data: req.body });
    res.status(200).json(newEvent);
  }
}

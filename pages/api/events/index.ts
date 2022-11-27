import { create } from 'domain';
import { PartialEvent } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { Prisma, prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filter: Prisma.EventFindManyArgs = {
      orderBy: { startDate: 'desc' },
      include: { location: { select: { name: true } } },
    };

    if (req.query.isPastEvent === 'true') filter.where = { startDate: { lt: new Date() } };
    if (req.query.isPastEvent === 'false') filter.where = { startDate: { gt: new Date() } };

    const events = await prisma.event.findMany(filter);
    res.status(200).json(events);
  } else if (req.method === 'POST' || req.method === 'PATCH') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    let upsertedEvent;

    const event = { ...req.body };

    if (req.method === 'POST') {
      const data = { ...req.body } as Prisma.EventCreateInput;
      delete data.location;

      data.user = { connect: { id: session.user.id } };

      if (event?.location?.name) data.location = { create: { ...event.location } };

      upsertedEvent = await prisma.event.create({ data: data });
    } else {
      const data = { ...req.body } as Prisma.EventUpdateInput;
      delete data.location;
      delete data.categories;
      //data.user = { connect: { id: session.user.id } };

      if (event?.location?.id) {
        await prisma.location.update({ data: { ...event.location }, where: { id: event.location.id } });
      }

      upsertedEvent = await prisma.event.update({ data, where: { id: event.id } });
    }
    res.status(200).json(upsertedEvent);
  }
}

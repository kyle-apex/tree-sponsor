import { create } from 'domain';
import { PartialEvent, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { Prisma, prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filter: Prisma.EventFindManyArgs = {
      orderBy: { startDate: 'desc' },
      include: { location: { select: { name: true } } },
    };

    if (req.query.isPastEvent === 'true') filter.where = { startDate: { lt: new Date() } };
    if (req.query.isPastEvent === 'false') filter.where = { startDate: { gt: new Date() } };

    const isAdmin = await isCurrentUserAuthorized('isAdmin', req);
    if (!isAdmin) filter.where.isPrivate = false;

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

      const existingPath = await prisma.event.findFirst({ where: { path: data.path } });
      if (existingPath) data.path = data.path += `-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
      //Prisma.UserCreateNestedManyWithoutOrganizedEventsInput;
      if (event.organizers)
        data.organizers = {
          connect: event.organizers.map((user: PartialUser) => {
            return { id: user?.id };
          }),
        };
      upsertedEvent = await prisma.event.create({ data: data });
    } else {
      delete req.body.location;
      const data = { ...req.body } as Prisma.EventUncheckedUpdateInput;
      delete data.categories;

      if (event.organizers)
        data.organizers = {
          set: event.organizers.map((user: PartialUser) => {
            return { id: user?.id };
          }),
        };
      else data.organizers = { set: [] };

      if (event?.location?.id) {
        await prisma.location.update({ data: { ...event.location }, where: { id: event.location.id } });
      } else {
        const newLocation = await prisma.location.create({ data: { ...event.location } });
        data.locationId = newLocation.id;
      }

      upsertedEvent = await prisma.event.update({ data, where: { id: event.id } });
    }
    res.status(200).json(upsertedEvent);
  }
}

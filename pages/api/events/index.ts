import { create } from 'domain';
import { PartialCategory, PartialEvent, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import getEventImagePath from 'utils/aws/get-event-image-path';
import uploadImage from 'utils/aws/upload-image';
import { Prisma, prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filter: Prisma.EventFindManyArgs = {
      orderBy: { startDate: 'desc' },
      include: {
        location: { select: { name: true } },
        // Include SpeciesQuizResponse count when hasQuizResponses is true
        ...(req.query.hasQuizResponses === 'true' && {
          _count: {
            select: { SpeciesQuizResponse: true },
          },
        }),
      },
    };

    // Initialize where clause if it doesn't exist
    if (!filter.where) filter.where = {};

    if (req.query.isPastEvent === 'true') filter.where.startDate = { lt: new Date() };
    if (req.query.isPastEvent === 'false') filter.where.startDate = { gt: new Date() };

    // Add forHomepage filter to get events with description and pictureUrl
    if (req.query.forHomepage === 'true') {
      filter.where.description = { not: null };
      filter.where.pictureUrl = { not: null };
      filter.where.isPrivate = false;
    } else {
      // Only apply isPrivate filter if not already set by forHomepage
      const isAdmin = await isCurrentUserAuthorized('isAdmin', req);
      if (!isAdmin) filter.where.isPrivate = false;
    }

    // Add filter for events with quiz responses
    if (req.query.hasQuizResponses === 'true') {
      filter.where.SpeciesQuizResponse = {
        some: {}, // At least one quiz response
      };
    }

    // Add limit if specified
    if (req.query.limit && !isNaN(Number(req.query.limit))) {
      filter.take = Number(req.query.limit);
    }

    const events = await prisma.event.findMany(filter);
    res.status(200).json(events);
  } else if (req.method === 'POST' || req.method === 'PATCH') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    let upsertedEvent;

    const event = { ...req.body };

    const pictureUrl = event?.pictureUrl;

    if (pictureUrl && !pictureUrl.startsWith('http')) {
      const uuid = uuidv4();
      const imagePath = getEventImagePath(uuid);

      const newPictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}`;

      event.pictureUrl = newPictureUrl;

      const fileContent = pictureUrl.split(',')[1];

      await uploadImage(fileContent, pictureUrl.substring(pictureUrl.indexOf(':') + 1, pictureUrl.indexOf(';')), imagePath);
    }

    if (req.method === 'POST') {
      const data = { ...req.body } as Prisma.EventCreateInput;
      delete data.location;

      data.pictureUrl = event.pictureUrl;

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
      if (event.categories)
        data.categories = {
          connect: event.categories.map((category: PartialCategory) => {
            return { id: category?.id };
          }),
        };
      upsertedEvent = await prisma.event.create({ data: data });
    } else {
      delete req.body.location;
      const trees = req.body.trees;
      delete req.body.trees;
      const data = { ...req.body } as Prisma.EventUncheckedUpdateInput;
      //delete data.categories;

      data.pictureUrl = event.pictureUrl;

      if (event.organizers)
        data.organizers = {
          set: event.organizers.map((user: PartialUser) => {
            return { id: user?.id };
          }),
        };
      else data.organizers = { set: [] };

      if (event.categories)
        data.categories = {
          set: event.categories.map((category: PartialCategory) => {
            return { id: category?.id };
          }),
        };
      else data.categories = { set: [] };

      if (event?.location?.id) {
        await prisma.location.update({ data: { ...event.location }, where: { id: event.location.id } });
      } else {
        const newLocation = await prisma.location.create({ data: { ...event.location } });
        data.locationId = newLocation.id;
      }
      trees?.forEach(async (tree: PartialTree, idx: number) => {
        await prisma.treeToEvent.update({ where: { treeId_eventId: { treeId: tree.id, eventId: event.id } }, data: { sequence: idx } });
      });

      upsertedEvent = await prisma.event.update({ data, where: { id: event.id } });
    }
    res.status(200).json(upsertedEvent);
  }
}

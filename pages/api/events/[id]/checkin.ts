import { PartialEventCheckIn, PartialTree } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = String(req.query.email);
  const firstName = String(req.query.firstName);
  const lastName = String(req.query.lastName);
  const discoveredFrom = String(req.query.discoveredFrom);
  const emailOptIn = req.query.emailOptIn === 'true';

  const event = await prisma.event.findFirst({ where: { id: eventId }, include: { location: {} } });

  if (req.method === 'GET') {
    let subscription;
    let user = await prisma.user.findFirst({ where: { email } });

    if (user && !user.name && firstName) {
      user.name = `${firstName} ${lastName}`.trim();
      await prisma.user.update({ where: { email }, data: { name: user.name } });
    } else if (!user) {
      user = await prisma.user.create({ data: { email, name: `${firstName} ${lastName}`.trim() } });
    }

    const userId = user?.id;
    const updateCheckin: PartialEventCheckIn = {
      userId,
      discoveredFrom,
    };
    const createCheckin: PartialEventCheckIn = { eventId, userId, email, discoveredFrom };

    if (emailOptIn) {
      createCheckin['emailOptIn'] = true;
      updateCheckin['emailOptIn'] = true;
    }

    const newCheckin = await prisma.eventCheckIn.upsert({
      where: { email_eventId: { email, eventId } },
      create: createCheckin,
      update: updateCheckin,
    });
    console.log('newCheckin', newCheckin);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const checkins = await prisma.eventCheckIn.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            displayName: true,
            profilePath: true,
            roles: {},
            profile: {},
            subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } } },
          },
        },
      },
    });
    console.log('checkins', checkins);
    const checkInCount = checkins.length;
    const attendees = checkins
      .filter(checkin => checkin.user)
      .map(checkIn => {
        return checkIn.user;
      });
    attendees.sort((a, b) => {
      if (a.roles?.length > b.roles?.length) return -1;
      if (b.roles?.length > a.roles?.length) return 1;
      if (a.subscriptions?.length > b.subscriptions?.length) return -1;
      if (b.subscriptions?.length > a.subscriptions?.length) return 1;
      return a.name < b.name ? -1 : 1;
    });
    console.log('attendees', attendees);

    if (user) {
      //await updateSubscriptionsForUser(email);

      subscription = await prisma.subscriptionWithDetails.findFirst({
        where: { email: email },
        orderBy: { lastPaymentDate: 'desc' },
      });
    }

    let trees: PartialTree[] = [];

    if (event.location.latitude) {
      const whereFilter = getLocationFilterByDistance(Number(event.location.latitude), Number(event.location.longitude), 500);

      trees = await prisma.tree.findMany({
        where: whereFilter,
        include: {
          images: {},
          species: { select: { id: true, commonName: true } },
        },
      });
      console.log('trees', trees);
    }

    res.status(200).json({ subscription, checkInCount, attendees, trees });
  }
}

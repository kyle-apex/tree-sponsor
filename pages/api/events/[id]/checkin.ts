import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import getOrCreateTagId from 'utils/mailchimp/add-tag-to-members-by-name';
import getTagId from 'utils/mailchimp/get-tag-id';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

const roleHeirarchy = ['Member', 'Core Team', 'Staff', 'Exec Team'];
function getRoleHeirarchyIndex(roles: any[]) {
  let index = -1;
  roles.forEach(role => {
    const roleIndex = roleHeirarchy.indexOf(role.name);
    if (roleIndex > index) index = roleIndex;
  });
  return index;
}

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
    let user = (await prisma.user.findFirst({ where: { email }, include: { profile: {} } })) as PartialUser;

    if (user && !user.profile) {
      user.profile = await prisma.profile.create({ data: { userId: user.id } });
    }

    if (user && !user.name && firstName) {
      user.name = `${firstName} ${lastName}`.trim();
      await prisma.user.update({ where: { email }, data: { name: user.name } });
    }
    if (!user && firstName) {
      user = await prisma.user.create({ data: { email, name: `${firstName} ${lastName}`.trim(), profile: {} } });
    }

    const myCheckins = await prisma.eventCheckIn.findMany({
      where: { eventId: { not: eventId }, email: email },
      include: { event: { include: { location: true } } },
    });

    myCheckins?.sort((a, b) => {
      return a.event?.startDate > b.event?.startDate ? -1 : 1;
    });

    const existingCheckin = await prisma.eventCheckIn.findFirst({
      where: { email, eventId },
    });

    const userId = user?.id;
    const updateCheckin: Prisma.EventCheckInUncheckedUpdateInput = {
      userId,
      discoveredFrom,
    };
    const createCheckin: Prisma.EventCheckInUncheckedCreateInput = { eventId, userId, email, discoveredFrom };

    if (emailOptIn && firstName) {
      createCheckin['emailOptIn'] = true;
      updateCheckin['emailOptIn'] = true;
      if (email) addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false);
    }

    if (!existingCheckin) {
      // add mailchimp tag
      const yearPrefix = event.name.includes('2023') ? '' : '2023 ';
      const tagName = 'Event: ' + yearPrefix + event.name;
      if (email) addTagToMembersByName(tagName, [email]);
      // update the db with any membership changes
      updateSubscriptionsForUser(email);
    }

    if (userId) {
      const newCheckin = await prisma.eventCheckIn.upsert({
        where: { email_eventId: { email, eventId } },
        create: createCheckin,
        update: updateCheckin,
      });
    }
    //console.log('newCheckin', newCheckin);
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
            email: true,
            roles: {},
            profile: { select: { instagramHandle: true, linkedInLink: true, twitterHandle: true, organization: true, bio: true } },
            subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } }, select: { lastPaymentDate: true } },
          },
        },
      },
    });
    //console.log('checkins', checkins);
    const checkInCount = checkins.length;
    let myCheckin;
    const attendeesCount = checkins?.length;
    const attendees = checkins
      .filter(checkin => {
        if (checkin.userId == userId) {
          myCheckin = checkin;
          return true;
        }
        if (checkin.isPrivate) return false;
        return checkin.user;
      })
      .map(checkIn => {
        if (checkIn.user?.id != userId) delete checkIn.user.email;
        return checkIn.user;
      });
    attendees.sort((a, b) => {
      if (a.roles?.length > b.roles?.length) return -1;
      if (b.roles?.length > a.roles?.length) return 1;
      else if (a.roles?.length == 1 && b.roles?.length == 1 && getRoleHeirarchyIndex(a.roles) > getRoleHeirarchyIndex(b.roles)) return -1;
      else if (a.roles?.length == 1 && b.roles?.length == 1 && getRoleHeirarchyIndex(b.roles) > getRoleHeirarchyIndex(a.roles)) return 1;
      if (a.subscriptions?.length > b.subscriptions?.length) return -1;
      if (b.subscriptions?.length > a.subscriptions?.length) return 1;
      return a.name < b.name ? -1 : 1;
    });
    //console.log('attendees', attendees);

    if (user) {
      subscription = await prisma.subscriptionWithDetails.findFirst({
        where: { email: email },
        orderBy: { lastPaymentDate: 'desc' },
      });
    }

    let trees: PartialTree[] = [];

    if (event.location?.latitude) {
      const whereFilter = getLocationFilterByDistance(Number(event.location.latitude), Number(event.location.longitude), 500);

      trees = await prisma.tree.findMany({
        where: whereFilter,
        include: {
          images: {},
          species: { select: { id: true, commonName: true } },
        },
      });
    }

    res.status(200).json({ subscription, checkInCount, attendees, trees, myCheckin, attendeesCount, myCheckins });
  }
}

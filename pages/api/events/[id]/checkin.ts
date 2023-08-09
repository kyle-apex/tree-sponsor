import RoleTable from 'components/admin/RoleTable';
import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import throwError from 'utils/api/throw-error';
import findOrCreateCheckinUser from 'utils/events/find-or-create-checkin-user';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import getOrCreateTagId from 'utils/mailchimp/add-tag-to-members-by-name';
import getTagId from 'utils/mailchimp/get-tag-id';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
import { sortUsersByRole } from 'utils/user/sort-users-by-role';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = String(req.query.email);
  const firstName = String(req.query.firstName);
  const lastName = String(req.query.lastName);
  const discoveredFrom = String(req.query.discoveredFrom);
  const emailOptIn = req.query.emailOptIn === 'true';

  const event = await prisma.event.findFirst({ where: { id: eventId }, include: { location: {}, organizers: {} } });

  const eventCompletedDate = event.startDate;
  eventCompletedDate.setDate(eventCompletedDate.getDate() + 1);
  eventCompletedDate.setHours(0);

  if (req.method === 'GET') {
    let subscription;
    const user = await findOrCreateCheckinUser({
      email,
      firstName,
      lastName,
    });

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
      if (email) {
        const result = await addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false);
        if (result?.new_members?.length > 0) {
          addTagToMembersByName('Event Attendee', [email]);
        }
      }
    }

    if (!existingCheckin) {
      // add mailchimp tag
      const yearPrefix = event.name.includes('2023') ? '' : '2023 ';
      const tagName = 'Event: ' + yearPrefix + event.name;
      if (email) addTagToMembersByName(tagName, [email]);
      // update the db with any membership changes
      updateSubscriptionsForUser(email);
    }

    if (userId && new Date() < eventCompletedDate) {
      const newCheckin = await prisma.eventCheckIn.upsert({
        where: { email_eventId: { email, eventId } },
        create: createCheckin,
        update: updateCheckin,
      });
    }
    //console.log('newCheckin', newCheckin);

    const checkins = (await prisma.eventCheckIn.findMany({
      where: { eventId },
      include: {
        user: {
          select: getUserDisplaySelect(),
        },
      },
    })) as PartialEventCheckIn[];
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
        const user = checkIn.user;
        if (user && !!event.organizers?.find(organizer => organizer.id == user.id)) {
          if (!user.roles) user.roles = [];
          user.roles.push({ name: 'Organizer' });
        }
        if (user.email?.endsWith('@treefolks.org')) user.roles.push({ name: 'Staff' });
        if (user?.id != userId) delete user.email;
        return user;
      });

    sortUsersByRole(attendees);

    if (user) {
      subscription = await prisma.subscriptionWithDetails.findFirst({
        where: { email: email },
        orderBy: { lastPaymentDate: 'desc' },
      });
    }

    res.status(200).json({ subscription, checkInCount, attendees, myCheckin, attendeesCount, myCheckins });
  }
}

import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import throwError from 'utils/api/throw-error';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import getOrCreateTagId from 'utils/mailchimp/add-tag-to-members-by-name';
import getTagId from 'utils/mailchimp/get-tag-id';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

const roleHeirarchy = ['Member', 'Core Team', 'Staff', 'Exec Team', 'Organizer'];
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

  const user = (await prisma.user.findFirst({ where: { email } })) as PartialUser;
  const userId = user?.id;

  if (!userId) return res.status(200).json({});

  if (req.method === 'GET') {
    const event = await prisma.event.findFirst({ where: { id: eventId }, include: { organizers: {} } });

    const checkins = (await prisma.eventCheckIn.findMany({
      where: { eventId },
      include: {
        user: {
          select: getUserDisplaySelect(),
        },
      },
    })) as PartialEventCheckIn[];
    //console.log('checkins', checkins);
    const checkInCount = checkins?.length || 0;

    const attendees = checkins
      .filter(checkin => {
        if (checkin.userId == userId) {
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
        if (user?.id != userId) delete user.email;
        return user;
      });
    attendees.sort((a, b) => {
      if (getRoleHeirarchyIndex(a.roles) > getRoleHeirarchyIndex(b.roles)) return -1;
      else if (getRoleHeirarchyIndex(b.roles) > getRoleHeirarchyIndex(a.roles)) return 1;
      if (a.roles?.length > b.roles?.length) return -1;
      if (b.roles?.length > a.roles?.length) return 1;
      if (a.subscriptions?.length > b.subscriptions?.length) return -1;
      if (b.subscriptions?.length > a.subscriptions?.length) return 1;
      return a.name < b.name ? -1 : 1;
    });

    res.status(200).json({ attendees, checkInCount });
  }
}

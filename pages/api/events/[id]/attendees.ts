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

  const user = (await prisma.user.findFirst({ where: { email } })) as PartialUser;
  const userId = user?.id;

  if (!userId) return res.status(200).json({});

  if (req.method === 'GET') {
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
    const attendeesCount = checkins?.length;
    const attendees = checkins
      .filter(checkin => {
        if (checkin.userId == userId) {
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

    res.status(200).json({ attendees, checkInCount });
  }
}

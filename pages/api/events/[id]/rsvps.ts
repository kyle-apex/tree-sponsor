import RoleTable from 'components/admin/RoleTable';
import { PartialEventCheckIn, PartialEventRSVP, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import throwError from 'utils/api/throw-error';
import { scheduleSendRsvpConfirmation } from 'utils/email/send-rsvp-confirmation';
import findOrCreateCheckinUser from 'utils/events/find-or-create-checkin-user';
import addEventToMember from 'utils/mailchimp/add-event-to-member';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import getOrCreateTagId from 'utils/mailchimp/add-tag-to-members-by-name';
import getTagId from 'utils/mailchimp/get-tag-id';
import { getLocationFilterByDistance } from 'utils/prisma/get-location-filter-by-distance';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
import listTreesForEvent from 'utils/tree/list-trees-for-event';
import { getUserByEmail } from 'utils/user/get-user-by-email';
import { sortUsersByRole } from 'utils/user/sort-users-by-role';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = req.body.email ? String(req.body.email)?.trim() : null;
  const name = String(req.body.name)?.trim();
  const invitedByUserId = req.body.invitedByUserId ? Number(req.body.invitedByUserId) : null;
  const detailsEmailOptIn = req.body.detailsEmailOptIn === true;
  const emailOptIn = req.body.emailOptIn === true;
  const status = req.body.status || 'Going';

  const event = await prisma.event.findFirst({
    where: { id: eventId },
    include: { location: true },
  });

  const eventCompletedDate = new Date(event.startDate);
  eventCompletedDate.setDate(eventCompletedDate.getDate() + 1);

  if (req.method === 'POST') {
    const nameSplit = name.split(' ');
    const firstName = nameSplit.shift();
    const lastName = nameSplit.join(' ');

    const user = await findOrCreateCheckinUser({
      email,
      firstName,
      lastName,
    });

    const userId = user?.id;

    if (!userId || new Date() < eventCompletedDate) {
      res.status(200).json({});
      return;
    }

    const updateRSVP: Prisma.EventRSVPUncheckedUpdateInput = {
      userId,
      emailOptIn,
      eventDetailsEmailOptIn: detailsEmailOptIn,
      invitedByUserId,
      status,
    };
    const createRSVP: Prisma.EventRSVPUncheckedCreateInput = {
      eventId,
      userId,
      email,
      invitedByUserId,
      emailOptIn,
      eventDetailsEmailOptIn: detailsEmailOptIn,
      status,
    };

    if (emailOptIn && firstName && email) {
      await addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false);

      addTagToMembersByName('Event RSVP', [email]);
      addTagToMembersByName('Event RSVP: ' + event.name, [email]);
    }
    if (detailsEmailOptIn && firstName && email && process.env.MAILCHIMP_EVENT_LIST_ID) {
      if (!emailOptIn) await addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false, process.env.MAILCHIMP_EVENT_LIST_ID);
      addTagToMembersByName('Event RSVP: ' + event.name, [email], process.env.MAILCHIMP_EVENT_LIST_ID);
    }

    // Check if this is a new RSVP or an update
    const existingRSVP = await prisma.eventRSVP.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    const newRSVP = await prisma.eventRSVP.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: createRSVP,
      update: updateRSVP,
    });

    // If this is a new RSVP (not an update) and the status is 'Going', send confirmation email
    if (status === 'Going' || status == 'Maybe') {
      try {
        // Prepare the eventRSVP object with all necessary data for the email
        const eventRSVPData: PartialEventRSVP = {
          event: {
            ...event,
            path: event.path || '',
          },
          user: {
            id: userId,
            email: email,
            name: `${firstName} ${lastName}`.trim(),
          },
          status,
        };

        // Schedule the confirmation email to be sent after 2 minutes
        await scheduleSendRsvpConfirmation(eventRSVPData);
        console.log(`Scheduled RSVP confirmation email for ${email}`);
      } catch (error) {
        console.error('Error scheduling RSVP confirmation email:', error);
        // Don't fail the API call if email scheduling fails
      }
    }

    res.status(200).json(newRSVP);
  } else if (req.method === 'GET') {
    const eventId = Number(req.query.id);
    const email = req.query.email ? req.query.email + '' : '';
    if (email) {
      const user = await getUserByEmail(email, { select: { id: true, email: true, image: true, name: true } });
      if (!user?.id || !eventId) {
        res.status(200).json([]);
        return;
      }
      const rsvp = await prisma.eventRSVP.findFirst({
        where: { eventId: eventId, userId: user?.id },
        include: { user: { select: { name: true, image: true, id: true } } },
        orderBy: { createdDate: 'asc' },
      });

      res.status(200).json({ rsvp, user });
    } else {
      const rsvps = await prisma.eventRSVP.findMany({
        where: { eventId: eventId },
        include: { user: { select: { name: true, image: true, id: true } } },
        orderBy: { createdDate: 'asc' },
      });

      res.status(200).json(rsvps);
    }
  }
}

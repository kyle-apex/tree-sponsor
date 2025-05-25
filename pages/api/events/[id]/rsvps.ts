import RoleTable from 'components/admin/RoleTable';
import { PartialEventCheckIn, PartialEventRSVP, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect, getRsvpUserSelect } from 'prisma/common';
import throwError from 'utils/api/throw-error';
import { scheduleSendRsvpConfirmation } from 'utils/email/send-rsvp-confirmation';
import { sendInviterNotification } from 'utils/email/send-inviter-notification';
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
import createInvitePreviewImage from 'utils/events/create-invite-preview-image';
import getOneYearAgo from 'utils/data/get-one-year-ago';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = req.body.email ? String(req.body.email)?.trim() : null;
  const name = String(req.body.name)?.trim();
  const invitedByUserId = req.body.invitedByUserId ? Number(req.body.invitedByUserId) : null;
  const detailsEmailOptIn = req.body.detailsEmailOptIn === true;
  const emailOptIn = req.body.emailOptIn === true;
  const status = req.body.status || 'Going';
  const comment = req.body.comment ? String(req.body.comment) : undefined;
  const notifyInviter = req.body.notifyInviter === true || status === 'Going' || status === 'Maybe';

  const event = await prisma.event.findFirst({
    where: { id: eventId },
    include: { location: true },
  });

  const eventCompletedDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
  if (!event.endDate) eventCompletedDate.setHours(eventCompletedDate.getHours() + 5);

  if (req.method === 'POST') {
    const nameSplit = name.split(' ');
    const firstName = nameSplit.shift();
    const lastName = nameSplit.join(' ');

    const user = await findOrCreateCheckinUser({
      email,
      firstName,
      lastName,
    });
    console.log('User found or created:', user);

    const userId = user?.id;

    if (!userId) {
      // remove for testing purposes || new Date() > eventCompletedDate) {
      console.log('Event is over or userId is missing', userId);
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

    if (user?.image && event.pictureUrl) {
      createInvitePreviewImage(event.pictureUrl, event.id + '-' + user.id.toString(), user.image).catch(error => {
        console.error('Error creating invite preview image:', error);
      });
    }

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
      id: newRSVP?.id,
    };

    // Send confirmation email to the user who RSVP'd (for Going or Maybe)
    if (status === 'Going' || status === 'Maybe') {
      try {
        // Schedule the confirmation email to be sent after 2 minutes
        await scheduleSendRsvpConfirmation(eventRSVPData);
        console.log(`Scheduled RSVP confirmation email for ${email}`);
      } catch (error) {
        console.error('Error scheduling RSVP confirmation email:', error);
        // Don't fail the API call if email scheduling fails
      }
    }

    // Send notification to the inviter if applicable
    if (invitedByUserId && notifyInviter) {
      try {
        // Get the inviter's user data
        const invitedByUser = await prisma.user.findUnique({
          where: { id: invitedByUserId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        if (invitedByUser && invitedByUser.email) {
          // Schedule the notification email to be sent to the inviter
          await sendInviterNotification(eventRSVPData, invitedByUser, comment);
          console.log(`Scheduled inviter notification email for ${invitedByUser.email}`);
        }
      } catch (error) {
        console.error('Error scheduling inviter notification email:', error);
        // Don't fail the API call if email scheduling fails
      }
    }

    res.status(200).json(newRSVP);
  } else if (req.method === 'GET') {
    const eventId = Number(req.query.id);
    const email = req.query.email ? req.query.email + '' : '';
    const invitedByUserId = req.query.invitedByUserId ? Number(req.query.invitedByUserId) : null;

    // Case 1: Filter by email to get a specific user's RSVP
    if (email) {
      const user = await getUserByEmail(email, {
        select: {
          id: true,
          email: true,
          image: true,
          name: true,
          createdAt: true,
          subscriptions: {
            where: { lastPaymentDate: { gte: getOneYearAgo() } },
            take: 1,
            select: { lastPaymentDate: true, id: true },
          },
        },
      });
      if (!user?.id || !eventId) {
        res.status(200).json([]);
        return;
      }
      const rsvp = await prisma.eventRSVP.findFirst({
        where: { eventId: eventId, userId: user?.id },
        include: {
          user: getRsvpUserSelect(),
        },
        orderBy: { createdDate: 'asc' },
      });

      res.status(200).json({ rsvp, user });
    }
    // Case 2: Filter by invitedByUserId to get all RSVPs invited by a specific user
    else if (invitedByUserId) {
      const rsvps = await prisma.eventRSVP.findMany({
        where: {
          eventId: eventId,
          invitedByUserId: invitedByUserId,
        },
        include: {
          user: getRsvpUserSelect(),
        },
        orderBy: { createdDate: 'asc' },
      });

      res.status(200).json(rsvps);
    }
    // Case 3: Get all RSVPs for the event
    else {
      const rsvps = await prisma.eventRSVP.findMany({
        where: { eventId: eventId },
        include: {
          user: getRsvpUserSelect(),
        },
        orderBy: { createdDate: 'asc' },
      });

      res.status(200).json(rsvps);
    }
  }
}

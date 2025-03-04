import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import { prisma, Prisma } from 'utils/prisma/init';
import { getUserByEmail } from 'utils/user/get-user-by-email';
import { sortUsersByRole } from 'utils/user/sort-users-by-role';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = req.query.email ? String(req.query.email) : null;

  console.log(`API request for event ${eventId}, email: ${email || 'none'}`);

  // Only get user if email is provided
  const user = email ? await getUserByEmail(email) : null;
  const userId = user?.id;

  if (req.method === 'GET') {
    const event = await prisma.event.findFirst({ where: { id: eventId }, include: { organizers: {} } });

    if (!event) {
      console.log(`Event ${eventId} not found`);
      return res.status(404).json({ error: 'Event not found' });
    }

    const checkins = (await prisma.eventCheckIn.findMany({
      where: { eventId },
      include: {
        user: {
          select: getUserDisplaySelect(),
        },
      },
      orderBy: {
        createdDate: 'desc', // Sort by check-in time, most recent first
      },
    })) as PartialEventCheckIn[];

    console.log(`Found ${checkins.length} check-ins for event ${eventId}`);

    const checkInCount = checkins?.length || 0;

    const attendees = checkins
      .filter(checkin => {
        // If email is provided, only show the user's own check-in and public check-ins
        if (email) {
          if (checkin.userId == userId) {
            return true;
          }
          if (checkin.isPrivate) return false;
        } else {
          // If no email provided (welcome page), show all non-private check-ins
          if (checkin.isPrivate) return false;
        }
        return checkin.user;
      })
      .map(checkIn => {
        const user = checkIn.user;

        if (user && !!event.organizers?.find(organizer => organizer.id == user.id)) {
          if (!user.roles) user.roles = [];
          user.roles.push({ name: 'Organizer' });
        }
        if (user.email?.endsWith('@treefolks.org') || user.email2?.endsWith('@treefolks.org')) {
          if (!user.roles) user.roles = [];
          user.roles.push({ name: 'Staff' });
        }

        // Only include email if this is the requesting user
        if (email && user?.id != userId) delete user.email;

        return user;
      });

    console.log(`Returning ${attendees.length} attendees after filtering`);

    // Sort by role if email is provided (for the checkin page)
    // Otherwise sort by check-in time (for the welcome page)
    if (email) {
      sortUsersByRole(attendees);
    }
    // No need to sort by time here as we already ordered by createdDate in the query

    res.status(200).json({ attendees, checkInCount });
  }
}

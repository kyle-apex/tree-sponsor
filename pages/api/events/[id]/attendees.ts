import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import { prisma, Prisma } from 'utils/prisma/init';
import { sortUsersByRole } from 'utils/user/sort-users-by-role';

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
        if (user.email?.endsWith('@treefolks.org')) user.roles.push({ name: 'Staff' });
        if (user?.id != userId) delete user.email;
        return user;
      });

    sortUsersByRole(attendees);

    res.status(200).json({ attendees, checkInCount });
  }
}

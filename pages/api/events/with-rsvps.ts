import { PartialEvent } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { Prisma, prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    // Check if user has event management permissions
    const hasEventManagement = await isCurrentUserAuthorized('hasEventManagement', req);
    if (!hasEventManagement) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get events that have at least 1 RSVP
    const eventsWithRsvps = await prisma.event.findMany({
      where: {
        RSVPs: {
          some: {}, // This ensures at least 1 RSVP exists
        },
      },
      orderBy: { startDate: 'desc' },
      include: { location: { select: { name: true } } },
    });

    return res.status(200).json(eventsWithRsvps);
  } catch (error) {
    console.error('Error fetching events with RSVPs:', error);
    return res.status(500).json({ message: 'Error fetching events with RSVPs', error });
  }
}

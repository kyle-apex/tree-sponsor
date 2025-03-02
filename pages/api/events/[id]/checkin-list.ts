import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const eventId = Number(req.query.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    // Fetch check-ins for the event
    const checkins = await prisma.eventCheckIn.findMany({
      where: {
        eventId,
        user: {
          hideFromCheckinPage: false,
        },
        isPrivate: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc', // Order by ID as a proxy for creation time
      },
      take: 50, // Limit to 50 most recent check-ins
    });

    // Format the response
    const formattedCheckins = checkins.map(checkin => {
      // Split the name into first and last name if available
      const nameParts = checkin.user?.name?.split(' ') || [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        ...checkin,
        user: {
          ...checkin.user,
          firstName,
          lastName,
        },
      };
    });

    return res.status(200).json({ checkins: formattedCheckins });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

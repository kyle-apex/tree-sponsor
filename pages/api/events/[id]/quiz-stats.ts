import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const eventId = Number(req.query.id);

  if (!eventId || isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    // Count correct quiz responses for this event
    const correctResponsesCount = await prisma.speciesQuizResponse.count({
      where: {
        eventId: eventId,
        isCorrect: true,
      },
    });

    return res.status(200).json({ correctResponsesCount });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz statistics' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';

/**
 * API endpoint to get the total donation amount for an event
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Event ID must be a number' });
    }

    // Get the sum of all StripeDonations for this event
    const donationSum = await prisma.stripeDonation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        eventId: eventId,
        status: 'succeeded', // Only count successful donations
      },
    });

    // Return the total amount or 0 if no donations found
    const totalAmount = donationSum._sum.amount ? Number(donationSum._sum.amount) : 0;

    return res.status(200).json({ totalAmount });
  } catch (error) {
    console.error('Error fetching donation data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

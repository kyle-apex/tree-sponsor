import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { PartialUser } from 'interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Get all donations for this event from both tables
    const stripeDonations = await prisma.stripeDonation.findMany({
      where: {
        eventId: parseInt(id),
        status: 'paid', // Only count completed donations
      },
    });

    // Get users who have donated
    const userIds = stripeDonations.filter(donation => donation.userId !== null).map(donation => donation.userId);

    // Fetch user details for donors
    const donors = await prisma.user.findMany({
      where: {
        id: {
          in: userIds as number[],
        },
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
      },
    });

    // Calculate total amount from both sources
    const stripeDonationAmount = stripeDonations.reduce(
      (sum, donation) => sum + (donation.amount ? parseFloat(donation.amount.toString()) : 0),
      0,
    );

    const totalAmount = stripeDonationAmount;

    return res.status(200).json({
      totalAmount,
      donations: [...stripeDonations],
      donors,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ error: 'Failed to fetch donations' });
  }
}

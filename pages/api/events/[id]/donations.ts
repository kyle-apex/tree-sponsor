import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { PartialUser } from 'interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Get all donations for this event
    const stripeDonations = await prisma.stripeDonation.findMany({
      where: {
        eventId: parseInt(id),
        status: 'paid', // Only count completed donations
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true,
          },
        },
      },
    });

    // Calculate total amount from both sources
    const stripeDonationAmount = stripeDonations.reduce(
      (sum, donation) => sum + (donation.amount ? parseFloat(donation.amount.toString()) : 0),
      0,
    );

    const totalAmount = stripeDonationAmount;

    // Extract unique donors from the donations
    const donors = stripeDonations
      .filter(donation => donation.user !== null)
      .map(donation => donation.user)
      .filter((user, index, self) => user && index === self.findIndex(u => u?.id === user.id));

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

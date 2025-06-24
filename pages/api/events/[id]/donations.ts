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
    const donations = await prisma.donation.findMany({
      where: {
        eventId: parseInt(id),
      },
    });

    // Calculate total amount from both sources
    const donationAmount = donations.reduce((sum, donation) => sum + (donation.amount ? parseFloat(donation.amount.toString()) : 0), 0);

    const totalAmount = donationAmount;

    // Since we don't have direct access to users through donations in the Donation model,
    // we'll return an empty array for donors
    const donors: PartialUser[] = [];

    return res.status(200).json({
      totalAmount,
      donations: [...donations],
      donors,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ error: 'Failed to fetch donations' });
  }
}

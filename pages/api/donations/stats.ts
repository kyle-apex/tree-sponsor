import { SubscriptionWithDetails } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

type Stats = {
  activeDonations: number;
  activeMembers: number;
  currentYearMemberDonations: number;
  currentYearDonations: number;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    where: { lastPaymentDate: { gt: calendarYear } },
    distinct: ['email'],
  });

  const stats: Stats = {
    activeDonations: 0,
    activeMembers: subscriptionWithDetails.length,
    currentYearMemberDonations: 0,
    currentYearDonations: 0,
  };

  stats.activeDonations = subscriptionWithDetails.reduce((previous, current) => {
    if (current.lastPaymentDate.getFullYear() == new Date().getFullYear()) stats.currentYearMemberDonations += current.amount;

    const total = previous + current.amount;
    return total;
  }, 0);

  const aggregate = await prisma.donation.aggregate({
    where: { date: { gt: calendarYear } },
    _sum: {
      amount: true,
    },
  });

  if (aggregate && aggregate._sum) stats.currentYearDonations = Number(aggregate._sum.amount);

  res.status(200).json(stats);
}

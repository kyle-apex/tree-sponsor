import { SubscriptionWithDetails } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getYearDateRange } from 'utils/get-year-date-range';
import { prisma, Prisma } from 'utils/prisma/init';

type Stats = {
  activeDonations: number;
  activeMembers: number;
  currentYearMemberDonations: number;
  currentYearDonations: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentYear = new Date().getFullYear();
  const year = req.query.year ? Number(req.query.year) : currentYear;
  const calendarYear = new Date();
  calendarYear.setFullYear(year);

  calendarYear.setDate(calendarYear.getDate() - 365);

  const { startDate, endDate } = getYearDateRange(year);
  console.log('startDate', startDate, endDate);

  let whereFilter: Prisma.SubscriptionWithDetailsWhereInput = { lastPaymentDate: { gt: calendarYear } };

  if (endDate) {
    whereFilter = { lastPaymentDate: { gt: startDate }, createdDate: { lt: endDate } };
  }

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    where: whereFilter,
    distinct: ['email'],
  });

  const stats: Stats = {
    activeDonations: 0,
    activeMembers: subscriptionWithDetails.length,
    currentYearMemberDonations: 0,
    currentYearDonations: 0,
  };

  stats.activeDonations = subscriptionWithDetails.reduce((previous, current) => {
    if (current.lastPaymentDate.getFullYear() == year || endDate) stats.currentYearMemberDonations += current.amount;

    const total = previous + current.amount;
    return total;
  }, 0);

  const aggregate = await prisma.donation.aggregate({
    where: { date: { gt: startDate, lt: endDate } },
    _sum: {
      amount: true,
    },
  });

  if (aggregate && aggregate._sum) stats.currentYearDonations = Number(aggregate._sum.amount);

  res.status(200).json(stats);
}

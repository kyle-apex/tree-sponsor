import { SubscriptionWithDetails } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getYearDateRange } from 'utils/get-year-date-range';
import { prisma, Prisma } from 'utils/prisma/init';

type Stats = {
  activeDonations: number;
  upcomingMemberDonations: number;
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

  const startDateString = req.query.startDate ? String(req.query.startDate) : null;
  const endDateString = req.query.endDate ? String(req.query.endDate) : null;

  let startDate: Date, endDate: Date;

  if (startDateString) {
    startDate = new Date(startDateString);
    if (endDateString) endDate = new Date(endDateString);
  } else {
    const result = getYearDateRange(year);
    startDate = result.startDate;
    endDate = result.endDate;
  }

  console.log('startDate', startDate, endDate);

  let whereFilter: Prisma.SubscriptionWithDetailsWhereInput = { lastPaymentDate: { gt: calendarYear } };

  if (endDate || startDateString) {
    whereFilter = { lastPaymentDate: { gt: startDate } };
    if (endDate) whereFilter.createdDate = { lt: endDate };
  }

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    where: whereFilter,
    distinct: ['email'],
  });

  const stats: Stats = {
    activeDonations: 0,
    upcomingMemberDonations: 0,
    activeMembers: subscriptionWithDetails.length,
    currentYearMemberDonations: 0,
    currentYearDonations: 0,
  };

  stats.activeDonations = subscriptionWithDetails.reduce((previous, current) => {
    if ((current.lastPaymentDate && current.lastPaymentDate?.getFullYear() == year) || endDate || startDateString) {
      stats.currentYearMemberDonations += current.amount;
    } else if (current.status == 'active') stats.upcomingMemberDonations += current.amount;

    if (current.status != 'active') return previous;

    const total = previous + current.amount;

    return total;
  }, 0);

  const dateWhereFilter: Prisma.DateTimeNullableFilter = {
    gt: startDate,
  };

  if (endDate) {
    dateWhereFilter.lt = endDate;
  }

  const aggregate = await prisma.donation.aggregate({
    where: { date: dateWhereFilter },
    _sum: {
      amount: true,
    },
  });

  if (aggregate && aggregate._sum) stats.currentYearDonations = Number(aggregate._sum.amount);

  res.status(200).json(stats);
}

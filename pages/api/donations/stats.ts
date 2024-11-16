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

  let subscriptionWithDetailsForUpcoming;

  // we want to figure out upcoming donations before this date
  if (endDate > new Date()) {
    const currentDateMinusOneYear = new Date();
    currentDateMinusOneYear.setFullYear(currentDateMinusOneYear.getFullYear() - 1);

    // this can be refactored to use only one call rather than two
    subscriptionWithDetailsForUpcoming = await prisma.subscriptionWithDetails.findMany({
      where: { lastPaymentDate: { gt: currentDateMinusOneYear }, status: 'active' },
      distinct: ['email'],
    });

    const existingAmountsByMonthAndDay: Record<string, number> = {};
    subscriptionWithDetailsForUpcoming?.forEach(sub => {
      const monthAndDay = sub.lastPaymentDate.getMonth() + ';' + sub.lastPaymentDate.getDate();
      if (!existingAmountsByMonthAndDay[monthAndDay]) existingAmountsByMonthAndDay[monthAndDay] = 0;
      existingAmountsByMonthAndDay[monthAndDay] += sub.amount;
    });

    const current = new Date();
    current.setDate(current.getDate() + 1);

    // Loop through each day in the future
    while (current <= endDate) {
      const monthAndDay = current.getMonth() + ';' + current.getDate();
      if (existingAmountsByMonthAndDay[monthAndDay]) stats.upcomingMemberDonations += existingAmountsByMonthAndDay[monthAndDay];

      current.setDate(current.getDate() + 1);
    }
  }

  stats.activeDonations = subscriptionWithDetails.reduce((previous, current) => {
    if ((current.lastPaymentDate && current.lastPaymentDate?.getFullYear() == year) || endDate || startDateString) {
      stats.currentYearMemberDonations += current.amount;
    } else if (current.status == 'active' && !subscriptionWithDetailsForUpcoming?.length) stats.upcomingMemberDonations += current.amount;

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

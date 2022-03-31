import { SubscriptionWithDetails } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { prisma } from 'utils/prisma/init';

type Stats = {
  active: number;
  newActive: number;
  newInactive: number;
  percentageByYear: number[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let dateFilter = req.query.dateFilter ? new Date(req.query.dateFilter as string) : null;

  if (!dateFilter) {
    dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - 30);
  }

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  const stats: Stats = {
    active: 0,
    newActive: 0,
    newInactive: 0,
    percentageByYear: [],
  };

  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  const calendarYearPlusWindow = new Date(
    new Date().getTime() - (new Date().getTime() - calendarYear.getTime()) + (dateFilter.getTime() - new Date().getTime()),
  );

  const inactiveAfterYearMap: Record<number, number> = {};
  const memberCountByYear: Record<number, number> = {};

  subscriptionWithDetails.forEach(item => {
    const memberYears = item.lastPaymentDate.getFullYear() - item.createdDate.getFullYear() + 1;

    if (!memberCountByYear[memberYears - 1]) memberCountByYear[memberYears - 1] = 0;
    memberCountByYear[memberYears - 1]++;

    if (item.createdDate > dateFilter) stats.newActive++;

    if (item.lastPaymentDate > calendarYear) stats.active++;
    else {
      if (item.lastPaymentDate > calendarYearPlusWindow) stats.newInactive++;

      if (!inactiveAfterYearMap[memberYears]) inactiveAfterYearMap[memberYears] = 0;
      inactiveAfterYearMap[memberYears]++;
    }
  });

  const keys = Object.keys(memberCountByYear);
  keys.shift();

  let inactiveCount = 0;

  const percentageByYear = keys.map((key: string) => {
    const yearCount = Number(key);
    if (inactiveAfterYearMap[yearCount]) {
      inactiveCount += inactiveAfterYearMap[yearCount];
    }
    const totalCount = keys.reduce((previousValue, currentValue) => {
      const currentYear = Number(currentValue);
      if (currentYear > 1 && currentYear <= yearCount && inactiveAfterYearMap[currentYear - 1])
        previousValue += inactiveAfterYearMap[currentYear - 1];

      if (currentYear < yearCount) return previousValue;
      else {
        return (previousValue += memberCountByYear[currentYear]);
      }
    }, 0);
    return Math.round((1 - inactiveCount / totalCount) * 100);
  });

  stats.percentageByYear = percentageByYear;

  res.status(200).json(stats);
}

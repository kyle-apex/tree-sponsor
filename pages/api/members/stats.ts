import { SubscriptionWithDetails } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import getOneYearAgo from 'utils/data/get-one-year-ago';
import { prisma } from 'utils/prisma/init';

type Stats = {
  active: number;
  newActive: number;
  newInactive: number;
  percentageByYear: { percentage: number; bestPercentage: number }[];
  predictedByEndOfYear: number;
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

  const results = (await prisma.$queryRaw`WITH PreviousYearsData AS (
    SELECT 
        YEAR(createdDate) AS year,
        SUM(CASE WHEN DATE_FORMAT(createdDate, '%m-%d') >= DATE_FORMAT(NOW(), '%m-%d') THEN 1 ELSE 0 END) AS after_today
    FROM SubscriptionWithDetails
    WHERE YEAR(createdDate) BETWEEN YEAR(NOW()) - 2 AND YEAR(NOW()) - 1
    GROUP BY YEAR(createdDate)
)
SELECT ROUND(AVG(after_today), 0) AS expected_users_after_today
FROM PreviousYearsData;`) as any[];

  const stats: Stats = {
    active: 0,
    newActive: 0,
    newInactive: 0,
    percentageByYear: [],
    predictedByEndOfYear: results ? Number(results[0]?.expected_users_after_today || 0) : 0,
  };

  const calendarYear = getOneYearAgo();

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
    console.log('inactiveCount', inactiveCount);
    console.log('totalCount', totalCount);
    console.log('activeCount', stats.active);

    return {
      percentage: Math.round((1 - inactiveCount / totalCount) * 100),
      bestPercentage: Math.round((1 - inactiveCount / (stats.active + inactiveCount)) * 100),
    };
  });

  console.log('percentageByYear', percentageByYear);

  stats.percentageByYear = percentageByYear;

  res.status(200).json(stats);
}

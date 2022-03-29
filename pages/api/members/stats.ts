import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

type Stats = {
  active: number;
  newActive: number;
  newInactive: number;
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
  console.log(subscriptionWithDetails);

  const stats: Stats = {
    active: 0,
    newActive: 0,
    newInactive: 0,
  };

  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  const calendarYearPlusWindow = new Date(
    new Date().getTime() - (new Date().getTime() - calendarYear.getTime()) + (dateFilter.getTime() - new Date().getTime()),
  );

  subscriptionWithDetails.forEach(item => {
    if (item.createdDate > dateFilter) stats.newActive++;

    if (item.lastPaymentDate > calendarYear) stats.active++;
    else if (item.lastPaymentDate > calendarYearPlusWindow) stats.newInactive++;
  });

  res.status(200).json(stats);
}

import { SubscriptionWithDetails } from '@prisma/client';
import { LeaderRow } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDisplaySelect } from 'prisma/common';
import { getYearDateRange } from 'utils/get-year-date-range';
import getYearStartDate from 'utils/get-year-start-date';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentYear = new Date().getFullYear();
  const year = req.query.year ? Number(req.query.year) : currentYear;
  const yearStart = getYearStartDate(year);

  const { startDate, endDate } = getYearDateRange(year);
  console.log('startDate', startDate, endDate);

  let whereFilter: Prisma.TreeWhereInput = { createdDate: { gt: yearStart }, createdByUserId: { not: null } };

  if (endDate) {
    whereFilter = { createdDate: { gt: startDate, lt: endDate }, createdByUserId: { not: null } };
  }

  //  whereFilter = { createdByUserId: { not: null } };
  console.log('where', whereFilter);

  const responses = await prisma.speciesQuizResponse.groupBy({
    by: ['treeId'],
    _count: true,
    having: {
      treeId: { _count: { gt: 1 } },
    },
  });

  if (responses?.length > 0) {
    whereFilter.id = { in: responses.map(response => response.treeId) };
  } else whereFilter.id = { in: [] };

  const groupedTrees = await prisma.tree.groupBy({
    by: ['createdByUserId'],
    _count: true,
    orderBy: {
      _count: {
        id: 'desc',
      },
    },

    where: whereFilter,
  });
  const userIds = groupedTrees.map(tree => tree.createdByUserId);

  const users = await prisma.user.findMany({
    select: getUserDisplaySelect(),
    where: {
      id: { in: userIds },
    },
  });
  //console.log('groupedTrees', groupedTrees, userIds, users);

  const leaders: LeaderRow[] = groupedTrees?.map((tree, idx) => {
    const row: LeaderRow = { position: idx + 1 };
    row.count = tree._count;
    row.user = users.find(user => user.id == tree.createdByUserId);
    return row;
  });
  // console.log('leaders', leaders);
  /*
  prisma.tree.findMany({});

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    where: whereFilter,
    distinct: ['email'],
  });

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
*/
  res.status(200).json(leaders);
}

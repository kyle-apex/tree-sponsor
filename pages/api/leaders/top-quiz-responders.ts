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

  let whereFilter: Prisma.SpeciesQuizResponseWhereInput = { createdDate: { gt: yearStart } };

  if (endDate) {
    whereFilter = { createdDate: { gt: startDate, lt: endDate } };
  }

  const responses = await prisma.speciesQuizResponse.groupBy({
    by: ['userId'],
    _count: true,
    where: {
      isCorrect: true,
      ...whereFilter,
    },
  });

  console.log('responses', responses);

  const userIds = responses.map(response => response.userId);

  const users = await prisma.user.findMany({
    select: getUserDisplaySelect(),
    where: {
      id: { in: userIds },
    },
  });
  console.log('users', users, userIds, users);

  const leaders: LeaderRow[] = responses?.map((response, idx) => {
    const row: LeaderRow = { position: idx + 1 };
    row.count = response._count;
    row.user = users.find(user => user.id == response.userId);
    return row;
  });
  console.log('leaders', leaders);

  res.status(200).json(leaders);
}
import { LeaderRow } from 'interfaces';
import { getUserDisplaySelect } from 'prisma/common';
import { getYearDateRange } from 'utils/get-year-date-range';
import getYearStartDate from 'utils/get-year-start-date';
import { prisma, Prisma } from 'utils/prisma/init';
import listTreesForEvent from 'utils/tree/list-trees-for-event';

export const listTopQuizResponders = async (
  yearFilter?: string | number,
  eventId?: number,
  currentUserEmail?: string,
): Promise<LeaderRow[]> => {
  const currentYear = new Date().getFullYear();
  const year = yearFilter ? Number(yearFilter) : currentYear;
  const yearStart = getYearStartDate(year);

  const { startDate, endDate } = getYearDateRange(year);

  const whereFilter: Prisma.SpeciesQuizResponseWhereInput = {}; //createdDate: { gt: yearStart } };

  if (endDate) {
    //whereFilter = { createdDate: { gt: startDate, lt: endDate } };
  }

  if (eventId) {
    const trees = await listTreesForEvent(eventId);
    if (trees?.length > 0) whereFilter.treeId = { in: trees.map(tree => tree.id) };
  }

  const responses = await prisma.speciesQuizResponse.groupBy({
    by: ['userId'],
    _count: true,
    where: {
      isCorrect: true,
      ...whereFilter,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  });

  //console.log('responses', responses);

  const userIds = responses.map(response => response.userId);

  const users = await prisma.user.findMany({
    select: getUserDisplaySelect(),
    where: {
      id: { in: userIds },
    },
  });
  //console.log('users', users, userIds, users);

  let previousCount = 0;
  let position = 1;

  const leaders: LeaderRow[] = responses
    ?.map((response, idx) => {
      if (previousCount && previousCount != response._count) position = idx + 1;
      previousCount = response._count;
      const row: LeaderRow = { position };
      row.count = response._count;

      row.user = users.find(
        user =>
          user.id == response.userId &&
          !(user.hideFromCheckinPage && (user.email != currentUserEmail || (user.email2 && user.email2 != currentUserEmail))),
      );
      return row;
    })
    .filter(leader => !!leader.user);

  return leaders;
};

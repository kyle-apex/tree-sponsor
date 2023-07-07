import { LeaderRow, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { listTopQuizResponders } from 'utils/leaders/list-top-quiz-responders';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;
  if (!email) return;
  const leaders: LeaderRow[] = await listTopQuizResponders(req.query.year as string);
  const results: LeaderRow[] = [];
  let currentLeader = leaders.find(leader => leader.user?.email == email);

  function addLeader(leader: LeaderRow) {
    results.push(leader); //{ ...leader.user, count: leader.count, rank: leader.position });
  }

  const lastPosition = leaders.length > 0 ? leaders.length + 1 : 1;

  if (!currentLeader) {
    const user = await prisma.user.findFirst({ where: { email } });
    currentLeader = { user, count: 0, position: lastPosition };
  }
  currentLeader.isCurrentUser = true;

  const currentIndex = leaders.indexOf(currentLeader);
  let lastPositionUserCount = 0;

  if (currentIndex === 0) {
    addLeader(currentLeader);
    if (leaders.length == 1) lastPositionUserCount = 2;
    else if (leaders.length == 2) {
      addLeader(leaders[1]);
      lastPositionUserCount = 1;
    } else {
      addLeader(leaders[1]);
      addLeader(leaders[2]);
    }
  } else if (currentIndex == leaders.length - 1) {
    if (leaders.length >= 2) {
      addLeader(leaders[currentIndex - 1]);
      lastPositionUserCount = 1;
    } else if (leaders.length == 1) lastPositionUserCount = 2;

    addLeader(currentLeader);
  } else if (currentIndex == -1) {
    if (leaders.length > 0) {
      lastPositionUserCount = 1;
      addLeader(leaders[leaders.length - 1]);
    } else {
      lastPositionUserCount = 2;
    }
    addLeader(currentLeader);
  } else {
    // somewhere in the middle of the list
    addLeader(leaders[currentIndex - 1]);
    addLeader(currentLeader);
    addLeader(leaders[currentIndex + 1]);
  }

  if (lastPositionUserCount > 0) {
    const excludedUserIds: number[] = leaders.map(leader => leader.user?.id);
    excludedUserIds.push(currentLeader.user.id);
    const lastPositionUsers = await prisma.eventCheckIn.findMany({
      take: lastPositionUserCount,
      orderBy: { createdDate: 'desc' },
      distinct: 'userId',
      where: { isPrivate: false, userId: { notIn: excludedUserIds } },
      select: { user: { select: { name: true, displayName: true, image: true } }, userId: true },
    });
    lastPositionUsers.forEach(userCheckin => {
      addLeader({ count: 0, user: userCheckin.user, position: lastPosition });
    });
  }

  res.status(200).json(results);
}

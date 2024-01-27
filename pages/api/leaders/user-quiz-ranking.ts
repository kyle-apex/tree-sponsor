import { LeaderRow, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { listTopQuizResponders } from 'utils/leaders/list-top-quiz-responders';
import { prisma } from 'utils/prisma/init';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;
  const eventId = req.query.eventId ? Number(req.query.eventId) : null;
  const showAll = (req.query.showAll as string) === 'true';
  if (!email) {
    res.status(200).json([]);
    return;
  }
  const leaders: LeaderRow[] = await listTopQuizResponders(req.query.year as string, eventId);
  const results: LeaderRow[] = [];
  let currentLeader = leaders.find(leader => leader.user?.email == email || leader.user?.email2 == email);

  /*let eventLeaders: LeaderRow[];

  if (eventId) eventLeaders = await listTopQuizResponders(req.query.year as string, eventId);*/

  function addLeader(leader: LeaderRow) {
    if (!leader.user) leader.user = { name: 'You' };
    results.push(leader); //{ ...leader.user, count: leader.count, rank: leader.position });
  }

  const lastPosition = leaders.length > 0 ? leaders.length + 1 : 1;

  if (!currentLeader) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const user = await getUserByEmail(email, {
      select: {
        id: true,
        name: true,
        image: true,
        displayName: true,
        profilePath: true,
        email: true,
        email2: true,
        subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } }, select: { lastPaymentDate: true } },
      },
    });

    currentLeader = { user, count: 0, position: lastPosition, isMember: user?.subscriptions?.length > 0 };
  }
  if (currentLeader) currentLeader.isCurrentUser = true;

  if (!showAll || leaders?.length == 0) {
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
      if (currentLeader?.user?.id) excludedUserIds.push(currentLeader.user.id);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const lastPositionUsers = await prisma.eventCheckIn.findMany({
        take: lastPositionUserCount,
        orderBy: { createdDate: 'desc' },
        distinct: 'userId',
        where: { isPrivate: false, userId: { notIn: excludedUserIds } },
        select: {
          user: {
            select: {
              name: true,
              displayName: true,
              image: true,
              subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } }, select: { lastPaymentDate: true } },
            },
          },
          userId: true,
        },
      });
      lastPositionUsers.forEach(userCheckin => {
        addLeader({ count: 0, user: userCheckin.user, position: lastPosition });
      });
    }
  } else {
    leaders.forEach(leader => {
      addLeader({
        user: leader.user,
        count: leader.count,
        position: leader.position,
        isCurrentUser: !!(
          (leader.user?.email == currentLeader?.user?.email && currentLeader?.user?.email) ||
          (leader.user?.email2 == currentLeader?.user?.email2 && currentLeader?.user?.email2)
        ),
      });
    });
    if (!leaders?.find(leader => leader.isCurrentUser) && currentLeader) addLeader(currentLeader);
  }

  results?.forEach(result => {
    result.isMember = result.user?.subscriptions?.length > 0;
    delete result.user?.subscriptions;
    if (!result.isCurrentUser) {
      delete result.user?.email;
      delete result.user?.email2;
    }
  });

  res.status(200).json(results);
}

import { LeaderRow, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { listTopQuizResponders } from 'utils/leaders/list-top-quiz-responders';
type U = PartialUser & { count: number; rank: number };

function addLeader(results: any[], leader: LeaderRow) {
  results.push({ ...leader.user, count: leader.count, rank: leader.position })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email;
  if (!email) return;
  const leaders = await listTopQuizResponders(req.query.year as string);
  const results: U[] = [];
  const currentLeader = leaders.find(leader => leader.user?.email == email);

  if (!currentLeader) {
  } else {
    const count = currentLeader.count;
    const rank = currentLeader.position;
    const currentIndex = leaders.indexOf(currentLeader);
    if (currentIndex == 0) {
      addLeader(results, currentLeader)
      if (leaders.length > 1) addLeader(results, leaders[1])
    } else (currentIndex == leaders.length - 1) {

      results.push({ ...currentLeader, count, rank })
    } else {

    }
  }

  res.status(200).json(leaders);
}

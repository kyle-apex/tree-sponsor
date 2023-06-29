import { PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { listTopQuizResponders } from 'utils/leaders/list-top-quiz-responders';
type U = PartialUser & { count: number; rank: number };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email;
  if (!email) return;
  const leaders = await listTopQuizResponders(req.query.year as string);

  const currentLeader = leaders.find(leader => leader.user?.email == email);

  if (!currentLeader) {
  } else {
    const currentIndex = leaders.indexOf(currentLeader);
  }

  res.status(200).json(leaders);
}

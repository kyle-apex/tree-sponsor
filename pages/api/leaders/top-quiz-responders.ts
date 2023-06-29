import { NextApiRequest, NextApiResponse } from 'next';
import { listTopQuizResponders } from 'utils/leaders/list-top-quiz-responders';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const leaders = await listTopQuizResponders(req.query.year as string);
  leaders.forEach(leader => delete leader.user?.email);
  res.status(200).json(leaders);
}

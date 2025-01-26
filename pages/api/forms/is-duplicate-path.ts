import { NextApiRequest, NextApiResponse } from 'next';
import isDuplicatePath from 'utils/forms/is-duplicate-path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path as string;
  const id = Number(req.query.id);
  if (req.method === 'GET') {
    const isDuplicate = await isDuplicatePath(id, path);
    res.status(200).json(isDuplicate);
  }
}

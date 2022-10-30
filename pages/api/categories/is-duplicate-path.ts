import { NextApiRequest, NextApiResponse } from 'next';
import isDuplicatePath from 'utils/categories/is-duplicate-path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.path as string;
  if (req.method === 'GET') {
    const isDuplicate = await isDuplicatePath(path);
    res.status(200).json(isDuplicate);
  }
}

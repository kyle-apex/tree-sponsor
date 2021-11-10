import { NextApiRequest, NextApiResponse } from 'next';
import isDuplicateProfilePath from 'utils/user/is-duplicate-profile-path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const profilePath = req.query.profilePath as string;
  if (req.method === 'GET') {
    const isDuplicate = await isDuplicateProfilePath(id, profilePath);
    res.status(200).json(isDuplicate);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const email = req.query.email as string;
  if (req.method === 'GET') {
    const duplicateUser = await getUserByEmail(email);
    const isDuplicate = duplicateUser && duplicateUser.id != id;

    res.status(200).json(isDuplicate);
  }
}

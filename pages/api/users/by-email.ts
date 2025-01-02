import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query?.email as string;
  const user = await getUserByEmail(email, { include: { profile: true } });

  res.status(200).json(user);
}

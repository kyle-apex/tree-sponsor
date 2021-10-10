import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (req.method === 'GET') {
    if (!session || !session.user) return res.status(200).json(false);
    const isAdmin = await hasAccessForQueriedUser({ email: session.user.email }, 'isAdmin');
    res.status(200).json(isAdmin);
  }
}

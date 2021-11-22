import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'GET') {
    const items = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdDate: 'desc' },
    });
    res.status(200).json(items);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    const userId = session.user.id;
    const category = await prisma.category.create({ data: { ...req.body, isPublic: true, userId } });
    res.status(200).json(category);
  }
}

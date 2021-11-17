import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  const id = Number(req.query.id);

  if (req.method === 'DELETE') {
    const comment = await prisma.comment.findFirst({ where: { id: id, userId: userId } });
    if (comment?.id) await prisma.comment.delete({ where: { id: id } });
    res.status(200).json({});
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  console.log('doing refresh', session);
  if (!session?.user?.id) return throwUnauthenticated(res);

  if (req.method === 'POST') {
    console.log('deleting account', session.user.id);
    await prisma.user.delete({ where: { id: session.user.id } });
    res.status(200).json({});
  }
}

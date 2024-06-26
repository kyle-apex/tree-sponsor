import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  const id = Number(req.query.id);

  if (req.method === 'DELETE') {
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized && userId) {
      const event = await prisma.event.findFirst({
        where: { userId: id },
      });
      if (event) isAuthorized = true;
    }
    if (isAuthorized) {
      const result = await prisma.event.delete({ where: { id: id } });
      res.status(200).json(result);
    }
  }
}

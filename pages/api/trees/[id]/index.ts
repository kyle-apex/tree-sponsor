import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const session = await getSession({ req });
  //if (!session?.user?.id) return throwUnauthenticated(res);
  //const userId = session.user.id;
  const id = Number(req.query.id);
  if (req.method === 'PATCH') {
    const isAuthorized = await isCurrentUserAuthorized('isTreeReviewer', req);

    if (!isAuthorized) {
      return throwError(res, 'Access denied');
    }
    const result = await prisma.tree.update({ where: { id }, data: req.body });
    res.status(200).json(result);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import throwError from 'utils/api/throw-error';
import { PartialUser } from 'interfaces';
import { sortUsersByRole } from 'utils/user/sort-users-by-role';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

  if (!isAuthorized) {
    return throwError(res, 'Access denied');
  }
  if (req.method === 'GET') {
    const query: Prisma.UserFindManyArgs = {
      orderBy: [{ displayName: 'desc' }, { name: 'desc' }],
      select: { displayName: true, name: true, id: true, email: true, roles: {} },
      take: 150,
    };

    if (req.query.search) {
      query.where = {
        OR: [
          { displayName: { contains: req.query.search as string } },
          { name: { contains: req.query.search as string } },
          { email: { contains: req.query.search as string } },
        ],
      };
    }

    const options = (await prisma.user.findMany(query)) as PartialUser[];

    sortUsersByRole(options);

    res.status(200).json(options);
  }
}

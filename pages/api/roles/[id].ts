import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('hasAuthManagement', req))) return;

  const id = Number(req.query.id);
  if (req.method === 'POST') {
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const usersWithThisRole = await prisma.user.findMany({
      where: {
        roles: {
          some: { id: id },
        },
      },
    });
    if (usersWithThisRole.length > 0) return throwError(res, `Cannot delete this role because it's currently being used by users`);
    else {
      const result = await prisma.role.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json(result);
    }
  }
}

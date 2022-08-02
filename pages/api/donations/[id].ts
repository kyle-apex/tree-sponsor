import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('isAdmin', req))) return;

  const id = Number(req.query.id);

  if (!id) return;

  if (req.method === 'DELETE') {
    const result = await prisma.donation.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(result);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('hasRedirectManagement', req))) return;

  const id = Number(req.query.id);
  if (req.method === 'POST' || req.method === 'PATCH') {
    const result = await prisma.subdomainRedirect.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const result = await prisma.subdomainRedirect.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(result);
  }
}

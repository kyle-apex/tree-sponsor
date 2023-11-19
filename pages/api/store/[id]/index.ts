// NextJS GET API using prisma to list all store products

import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === 'PATCH' && id) {
    const hasShirtManagement = await isCurrentUserAuthorized('hasShirtManagement', req);

    if (!hasShirtManagement) return throwUnauthenticated(res);

    const product = await prisma.storeProduct.update({ where: { id }, data: req.body });
    res.json(product);
  } else if (req.method == 'DELETE' && id) {
    const hasShirtManagement = await isCurrentUserAuthorized('hasShirtManagement', req);

    if (!hasShirtManagement) return throwUnauthenticated(res);

    const result = await prisma.storeProduct.delete({ where: { id } });
    res.json(result);
  }
}

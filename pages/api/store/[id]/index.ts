// NextJS GET API using prisma to list all store products

import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === 'PATCH' && id) {
    const isAdmin = await isCurrentUserAuthorized('isAdmin', req);
    const hasShirtManagement = await isCurrentUserAuthorized('hasShirtManagement', req);

    if (!isAdmin && !hasShirtManagement) return throwUnauthenticated(res);

    const product = await prisma.storeProduct.update({ where: { id }, data: req.body });
    res.json(product);
  }
}

// NextJS GET API using prisma to list all store products

import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    const userId = session.user.id;
    const products = await prisma.storeProduct.findMany({});
    res.json(products);
  } else if (req.method === 'POST') {
    const isAdmin = await isCurrentUserAuthorized('isAdmin', req);
    const hasShirtManagement = await isCurrentUserAuthorized('hasShirtManagement', req);

    if (!isAdmin && !hasShirtManagement) return throwUnauthenticated(res);

    const product = await prisma.storeProduct.create({ data: req.body });
    res.json(product);
  } else if (req.method === 'PATCH') {
    const isAdmin = await isCurrentUserAuthorized('isAdmin', req);
    const hasShirtManagement = await isCurrentUserAuthorized('hasShirtManagement', req);

    if (!isAdmin && !hasShirtManagement) return throwUnauthenticated(res);

    const product = await prisma.storeProduct.update({ where: { id: req.body.id }, data: req.body });
    res.json(product);
  }
}

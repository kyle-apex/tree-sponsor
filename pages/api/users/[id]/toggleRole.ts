import { NextApiRequest, NextApiResponse } from 'next';
import grantAccess from 'utils/auth/grant-access';
import removeAccess from 'utils/auth/remove-access';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'POST' || req.method === 'PATCH') {
    const { roleName, hasRole } = req.body;

    if (hasRole) await grantAccess(id, roleName, req);
    else await removeAccess(id, roleName, req);

    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        name: true,
        id: true,
        email: true,
        roles: { select: { name: true, id: true } },
        subscriptionsWithDetails: {},
      },
    });
    console.log('updated user', user);
    res.status(200).json(user);
  }
}

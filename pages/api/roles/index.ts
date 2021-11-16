import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    //const roles = [{ name: 'Admin', id: 1 }];
    res.status(200).json(roles);
  } else if (req.method === 'POST') {
    if (!(await isCurrentUserAuthorized('hasAuthManagement', req))) return;

    const role = await prisma.role.create({ data: req.body });
    res.status(200).json(role);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('isAdmin', req))) return;

  if (req.method === 'GET') {
    /*if (req.query.year) {
      const year = Number(req.query.year);
    }*/

    const roles = await prisma.donation.findMany({
      orderBy: { date: 'asc' },
    });
    res.status(200).json(roles);
  } else if (req.method === 'POST') {
    const role = await prisma.donation.create({ data: req.body });
    res.status(200).json(role);
  }
}

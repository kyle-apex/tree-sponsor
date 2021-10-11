import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany({
    where: {
      subscriptionsWithDetails: { some: { id: { gt: 0 } } },
    },
    orderBy: { name: 'asc' },
    select: {
      name: true,
      id: true,
      email: true,
      roles: { select: { name: true, id: true } },
      subscriptionsWithDetails: {},
    },
  });
  users.sort((a, b) => {
    return a.roles.length > b.roles.length ? -1 : a.name > b.name ? 0 : 1;
  });
  res.status(200).json(users);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import throwError from 'utils/api/throw-error';
import { PartialCategory } from 'interfaces';
import { getSession } from 'utils/auth/get-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const userId = session?.user?.id;
  if (req.method === 'GET') {
    const query: Prisma.CategoryFindManyArgs = {
      orderBy: [{ name: 'asc' }],
      select: { name: true, id: true, description: true },
      where: { OR: [{ isPublic: true }, { userId }] },
      take: 150,
    };

    if (req.query.search) {
      query.where = {
        AND: [
          { OR: [{ name: { contains: req.query.search as string } }, { description: { contains: req.query.search as string } }] },
          { OR: [{ isPublic: true }, { userId }] },
        ],
      };
    }

    const options = (await prisma.category.findMany(query)) as PartialCategory[];

    options?.sort((a, b) => {
      if (!a.isPublic && b.isPublic) return -1;
      else if (a.isPublic && !b.isPublic) return 1;
      else return a.name < b.name ? -1 : 1;
    });

    res.status(200).json(options);
  }
}

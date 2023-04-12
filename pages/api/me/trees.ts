import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma, Prisma } from 'utils/prisma/init';
import { PartialTreeChangeLog, ReviewStatus } from 'interfaces';
import { TreeChangeLog } from '@prisma/client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user?.id) return throwUnauthenticated(res);
  const userId = session.user.id;

  if (req.method === 'GET') {
    const reviewStatus = req.query.reviewStatus as ReviewStatus;
    const take = req.query.take ? Number(req.query.take) : null;
    const filter: Prisma.TreeChangeLogFindManyArgs = {
      orderBy: { createdDate: 'desc' },
      include: {
        tree: {
          include: {
            images: { orderBy: { sequence: 'asc' } },
          },
        },
      },
      //take: 1,
      where: { userId, type: 'Create' },
    };
    //if (reviewStatus) filter.where = { reviewStatus };
    if (take) filter.take = take;
    //filter.where.pictureUrl = { not: null };
    const treeChangeLogs = (await prisma.treeChangeLog.findMany(filter)) as PartialTreeChangeLog[];
    const trees = treeChangeLogs
      .map(changeLog => {
        return changeLog.tree;
      })
      .filter(tree => tree?.id);
    res.status(200).json(trees);
  }
}

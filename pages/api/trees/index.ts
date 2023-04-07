import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma, Prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { ReviewStatus } from 'interfaces';
import upsertTree from 'utils/tree/upsert';

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

  if (req.method === 'POST') {
    const tree = req.body;

    if (!tree) return throwError(res, 'Please submit new tree data.');

    const upsertedTree = await upsertTree(tree, userId);

    res.status(200).json(upsertedTree);
  } else if (req.method === 'GET') {
    const reviewStatus = req.query.reviewStatus as ReviewStatus;
    const take = req.query.take ? Number(req.query.take) : null;
    const filter: Prisma.TreeFindManyArgs = {
      orderBy: { createdDate: 'desc' },
      //take: 1,
      //where: { id: 5 },
    };
    if (reviewStatus) filter.where = { reviewStatus };
    if (take) filter.take = take;
    filter.where.pictureUrl = { not: null };
    const trees = await prisma.tree.findMany(filter);
    res.status(200).json(trees);
  }
}

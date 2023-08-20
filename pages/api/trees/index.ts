import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma, Prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialUser, ReviewStatus } from 'interfaces';
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

  if (req.method === 'POST') {
    let userId;
    let tree;
    const email = req.body.email;
    if (req.body.email !== undefined) {
      tree = req.body.tree;
      if (session?.user?.id) userId = session.user.id;
      else {
        const user = (await prisma.user.findFirst({ where: { email } })) as PartialUser;
        if (user) userId = user.id;
      }
    } else {
      userId = session?.user?.id;
      tree = req.body;
    }
    if (!userId) return throwUnauthenticated(res);

    if (!tree) return throwError(res, 'Please submit new tree data.');

    tree.sessionId = req.body.sessionId ? req.body.sessionId : uuidv4();

    const upsertedTree = await upsertTree(tree, userId, req.body.eventId);

    res.status(200).json(upsertedTree);
  } else if (req.method === 'GET') {
    if (!session?.user?.id && !req.query?.sessionId) return throwUnauthenticated(res);
    const userId = session?.user?.id;
    const reviewStatus = req.query?.reviewStatus as ReviewStatus;
    const sessionId = req.query?.sessionId as string;

    const take = req.query.take ? Number(req.query.take) : null;
    const filter: Prisma.TreeFindManyArgs = {
      orderBy: { createdDate: 'desc' },
      include: {
        images: { orderBy: { sequence: 'asc' } },
        categories: { select: { name: true, id: true } },
      },
      //take: 1,
      //where: { id: 5 },
    };

    if (reviewStatus) filter.where = { reviewStatus };
    if (sessionId) {
      if (!filter.where) filter.where = {};
      filter.where.sessionId = sessionId;
    }
    if (take) filter.take = take;
    if (!filter.where) filter.where = {};
    filter.where.pictureUrl = { not: null };
    let trees = await prisma.tree.findMany(filter);
    trees = trees.map(t => {
      // remove sessionId if not reading for particular sessionId
      return sessionId ? t : { ...t, sessionId: null };
    });
    res.status(200).json(trees);
  }
}

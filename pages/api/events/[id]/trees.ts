import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialTree } from 'interfaces';
import { v4 as uuidv4 } from 'uuid';

import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { Tree } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'GET') {
    const result = await prisma.event.findFirst({
      where: { id: id },
      include: {
        location: {
          include: {
            trees: {
              include: { sponsorships: {}, species: {} },
            },
          },
        },
      },
    });
    res.status(200).json(result);
  }
}

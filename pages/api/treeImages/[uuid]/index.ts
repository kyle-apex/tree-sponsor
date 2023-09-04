import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialTree, PartialTreeImage } from 'interfaces';
import { v4 as uuidv4 } from 'uuid';

import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { Tree, TreeImage } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import getBase64ImageDimensions from 'utils/aws/get-base64-image-dimensions';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { hasValidTreeSessionId } from 'utils/auth/has-valid-tree-session-id';
import { isAuthorizedToUpdateTree } from 'utils/auth/is-authorized-to-update-tree';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uuid = req.query.uuid as string;

  const treeImage = await prisma.treeImage.findFirst({ where: { uuid }, include: { tree: true } });

  const isAuthorized = await isAuthorizedToUpdateTree(req, treeImage?.tree?.id, 'isAdmin');
  if (!isAuthorized) return throwUnauthenticated(res);

  if (req.method === 'DELETE') {
    await prisma.treeImage.delete({ where: { uuid } });
    //if (treeImage?.tree?.pictureUrl && treeImage.url == treeImage.tree.pictureUrl) {
    const treeImages = await prisma.treeImage.findMany({ where: { treeId: treeImage.tree.id }, orderBy: { sequence: 'asc' } });
    let newPictureUrl = '';
    if (treeImages.length > 0) {
      const existingImage = treeImages.find(image => image.url == treeImage.tree.pictureUrl);
      if (!existingImage) newPictureUrl = treeImages[0].url;
      else newPictureUrl = existingImage.url;
    }

    if (treeImage.tree.pictureUrl != newPictureUrl)
      await prisma.tree.update({ where: { id: treeImage.tree.id }, data: { pictureUrl: newPictureUrl } });

    res.json({ count: 1 });
  } else if (req.method === 'PATCH') {
    const newTreeImage = req.body as Partial<TreeImage>;

    await prisma.treeImage.update({ where: { uuid }, data: { ...newTreeImage } });

    res.json({ count: 1 });
  }
}

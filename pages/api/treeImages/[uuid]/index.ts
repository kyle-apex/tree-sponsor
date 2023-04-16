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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const session = await getSession({ req });
  //if (!session?.user?.id) return throwUnauthenticated(res);
  //const userId = session.user.id;
  const uuid = req.query.uuid as string;
  if (req.method === 'DELETE') {
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);
    const session = await getSession({ req });

    const treeImage = await prisma.treeImage.findFirst({ where: { uuid }, include: { tree: true } });

    if (!isAuthorized && session?.user?.id) {
      if (!treeImage?.tree?.id) return;

      const changeLog = await prisma.treeChangeLog.findFirst({
        where: { tree: { id: treeImage.tree.id }, user: { id: session?.user?.id }, type: 'Create' },
      });
      if (changeLog) isAuthorized = true;
    }

    if (isAuthorized) {
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
      //}
      res.json({ count: 1 });
    } else {
      return throwError(res, 'Access denied');
    }
  } else if (req.method === 'PATCH') {
    const newTreeImage = req.body as Partial<TreeImage>;
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);
    const session = await getSession({ req });
    const treeImage = await prisma.treeImage.findFirst({ where: { uuid }, include: { tree: true } });

    if (!isAuthorized && session?.user?.id) {
      if (!treeImage?.tree?.id) return;

      const changeLog = await prisma.treeChangeLog.findFirst({
        where: { tree: { id: treeImage.tree.id }, user: { id: session?.user?.id }, type: 'Create' },
      });
      if (changeLog) isAuthorized = true;
    }

    if (isAuthorized) {
      await prisma.treeImage.update({ where: { uuid }, data: { ...newTreeImage } });

      res.json({ count: 1 });
    } else {
      return throwError(res, 'Access denied');
    }
  }
}

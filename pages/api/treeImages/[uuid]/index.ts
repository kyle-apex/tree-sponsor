import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { TreeImage } from '@prisma/client';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
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
    //if (treeImage?.tree?.pictureUrl && treeImage.url === treeImage.tree.pictureUrl) {
    const treeImages = await prisma.treeImage.findMany({ where: { treeId: treeImage.tree.id }, orderBy: { sequence: 'asc' } });
    let newPictureUrl = '';
    if (treeImages.length > 0) {
      const existingImage = treeImages.find(image => image.url === treeImage.tree.pictureUrl);
      if (!existingImage) newPictureUrl = treeImages[0].url;
      else newPictureUrl = existingImage.url;
    }

    if (treeImage.tree.pictureUrl !== newPictureUrl)
      await prisma.tree.update({ where: { id: treeImage.tree.id }, data: { pictureUrl: newPictureUrl } });

    res.json({ count: 1 });
  } else if (req.method === 'PATCH') {
    const newTreeImage = req.body as Partial<TreeImage>;

    await prisma.treeImage.update({ where: { uuid }, data: { ...newTreeImage } });

    res.json({ count: 1 });
  }
}

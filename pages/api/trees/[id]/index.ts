import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialTree } from 'interfaces';
import { v4 as uuidv4 } from 'uuid';

import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { Tree } from '@prisma/client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const session = await getSession({ req });
  //if (!session?.user?.id) return throwUnauthenticated(res);
  //const userId = session.user.id;
  const id = Number(req.query.id);
  if (req.method === 'PATCH') {
    const isAuthorized = await isCurrentUserAuthorized('isTreeReviewer', req);

    if (!isAuthorized) {
      return throwError(res, 'Access denied');
    }

    const tree = req.body as Partial<Tree>;

    const updateData: Prisma.TreeUpdateInput = { ...tree };

    const pictureUrl = tree?.pictureUrl;

    if (pictureUrl && !pictureUrl.includes('http')) {
      const image = { uuid: uuidv4() };
      const imagePath = getTreeImagePath(image.uuid);
      updateData.pictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;

      uploadTreeImages(pictureUrl, image.uuid);

      updateData.images = { upsert: [{ create: image, update: image, where: { uuid: image.uuid } }] };
    }

    const result = await prisma.tree.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(result);
  }
}

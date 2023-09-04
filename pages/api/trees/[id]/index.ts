import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialCategory, PartialTree, PartialTreeImage } from 'interfaces';
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
  //const session = await getSession({ req });
  //if (!session?.user?.id) return throwUnauthenticated(res);
  //const userId = session.user.id;
  const id = Number(req.query.id);
  const session = await getSession({ req });

  if (req.method === 'PATCH') {
    const isAuthorized = await isAuthorizedToUpdateTree(req, id, 'isTreeReviewer');

    if (!isAuthorized) return throwUnauthenticated(res);

    const tree = { ...req.body };

    const updateData = { ...req.body } as Prisma.TreeUncheckedUpdateInput;

    //const updateData: Prisma.TreeUpdateInput = { ...tree };

    if (tree.categories)
      updateData.categories = {
        set: tree.categories.map((category: PartialCategory) => {
          return { id: category?.id };
        }),
      };

    const pictureUrl = tree?.pictureUrl;

    if (pictureUrl && !pictureUrl.startsWith('http')) {
      // find existing tree
      const existingTree = await prisma.tree.findFirst({ where: { id: id }, include: { images: { orderBy: { sequence: 'asc' } } } });
      //let image = existingTree?.images?.find(img => img.url == existingTree.pictureUrl) as Partial<TreeImage>;

      const { width, height } = getBase64ImageDimensions(pictureUrl);

      //if (!image) {
      let newSequence = 0;

      if (existingTree?.images?.length > 0) {
        existingTree.images.forEach(image => {
          if (image.sequence >= newSequence) newSequence = image.sequence + 1;
        });
      }
      const image: Partial<TreeImage> = { uuid: uuidv4() };
      const imagePath = getTreeImagePath(image.uuid);

      const newPictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;
      delete updateData.pictureUrl;

      if (newSequence == 0) updateData.pictureUrl = newPictureUrl;
      else if (!existingTree.pictureUrl) {
        updateData.pictureUrl = existingTree.images[0].url;
      }

      image['width'] = width;
      image['height'] = height;

      updateData.images = {
        upsert: [
          {
            create: { uuid: image.uuid, url: newPictureUrl, width, height, sequence: newSequence },
            update: image,
            where: { uuid: image.uuid },
          },
        ],
      };
      /*} else {
        updateData.images = {
          update: { data: { width, height }, where: { uuid: image.uuid } },
        };
        delete updateData.pictureUrl;
      }*/

      await uploadTreeImages(pictureUrl, image.uuid);
    }

    const result = await prisma.tree.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const isAuthorized = await isAuthorizedToUpdateTree(req, id, 'isAdmin');

    if (isAuthorized) {
      await prisma.tree.delete({ where: { id } });
      res.json({ count: 1 });
    } else return throwUnauthenticated(res);
  }
}

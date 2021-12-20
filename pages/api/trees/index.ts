import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user?.id) return throwUnauthenticated(res);
  const userId = session.user.id;

  if (req.method === 'POST') {
    const tree = req.body;

    if (!tree) return throwError(res, 'Please submit new sponsorship data.');

    const treeId = tree.id;

    if (!treeId) {
      // remove id if it's 0 for the upsert to work correctly
      delete tree.id;
      tree.createdDate = new Date();
    }

    tree.lastChangedByUser = { connect: { id: userId } };

    const image = tree.images?.length > 0 && tree.images[0];

    if (image) {
      if (!image.uuid || image.uuid === 'temp') image.uuid = uuidv4();

      const pictureUrl = image?.url;

      if (pictureUrl && !pictureUrl.includes('http')) {
        const imagePath = getTreeImagePath(image.uuid);
        tree.pictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;

        uploadTreeImages(pictureUrl, image.uuid);
      }
    }

    const upsertedTree = await prisma.tree.upsert({
      where: { id: treeId || -1 },
      create: {
        ...tree,
        images: { create: image },
      },
      update: {
        ...tree,
        images: { upsert: [{ create: image, update: image, where: { uuid: image.uuid } }] },
      },
    });
    res.status(200).json(upsertedTree);
  }
}

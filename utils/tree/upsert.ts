import { prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { PartialTree, PartialTreeImage } from 'interfaces';
import { Prisma } from '@prisma/client';

//const what: Prisma.TreeCreateInput;

type TreeImage = PartialTreeImage & { uuid: string };

export default async function upsert(tree: PartialTree, userId: number) {
  const treeId = tree.id;

  if (!treeId) {
    // remove id if it's 0 for the upsert to work correctly

    tree.createdDate = new Date();
  }
  delete tree.id;

  const lastChangedByUser = { connect: { id: userId } };

  const image = (tree.images?.length > 0 && tree.images[0]) as TreeImage;

  if (image) {
    if (!image.uuid || image.uuid === 'temp') image.uuid = uuidv4();

    const pictureUrl = image?.url;

    if (pictureUrl && !pictureUrl.includes('http')) {
      const imagePath = getTreeImagePath(image.uuid);
      tree.pictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;

      uploadTreeImages(pictureUrl, image.uuid);
    }
  }

  const treeToUpdate: Omit<PartialTree, 'id' | 'locationId' | 'speciesId' | 'lastChangedByUserId'> = { ...tree };

  const upsertedTree = await prisma.tree.upsert({
    where: { id: treeId || -1 },
    create: {
      ...treeToUpdate,
      lastChangedByUser,
      images: { create: { ...image } },
    },
    update: {
      ...treeToUpdate,
      lastChangedByUser,
      images: { upsert: [{ create: { ...image }, update: image, where: { uuid: image.uuid } }] },
    },
  });
  return upsertedTree;
}

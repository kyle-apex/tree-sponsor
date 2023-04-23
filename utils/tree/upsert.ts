import { prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { PartialTree, PartialTreeImage } from 'interfaces';
import { Prisma } from '@prisma/client';

type TreeImage = PartialTreeImage & { uuid: string };

export default async function upsertTree(tree: PartialTree, userId: number) {
  const treeId = tree.id;

  if (!treeId) {
    // remove id if it's 0 for the upsert to work correctly

    tree.createdDate = new Date();
  }
  delete tree.id;

  const lastChangedByUser = { connect: { id: userId } };

  let image = (tree.images?.length > 0 && tree.images[0]) as TreeImage;

  if (tree.pictureUrl && !image) image = { url: tree.pictureUrl, uuid: 'temp' };

  if (image) {
    const pictureUrl = image.url;

    if (pictureUrl && !pictureUrl.startsWith('http')) {
      if (!image.uuid || image.uuid === 'temp') image.uuid = uuidv4();
      const imagePath = getTreeImagePath(image.uuid);
      tree.pictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;
      image.url = tree.pictureUrl;
      uploadTreeImages(pictureUrl, image.uuid);
    } else if (!image.uuid) {
      image = null;
    }
  }

  const speciesId = tree.speciesId;
  const species = tree.speciesId ? { connect: { id: speciesId } } : undefined;
  delete tree.speciesId;

  const treeToUpdate: Omit<
    PartialTree,
    'id' | 'locationId' | 'speciesId' | 'lastChangedByUserId' | 'species' | 'location' | 'speciesQuizResponses'
  > = { ...tree };

  //type upsertType = Prisma.TreeUpsertArgs | Prisma.TreeUpsertWithoutImagesInput;

  const upsertArgs: Prisma.TreeUpsertArgs = {
    where: { id: treeId || -1 },
    create: {
      ...treeToUpdate,
      lastChangedByUser,
      species,
      changeLogs: { create: { user: { connect: { id: userId } } } },
      images: {},
    },
    update: {
      ...treeToUpdate,
      lastChangedByUser,
      species,
      images: {},
    },
  };

  if (image) {
    let newSequence = 0;

    // get max sequence
    if (treeId) {
      const maxSequence = await prisma.treeImage.aggregate({
        _max: {
          sequence: true,
        },
        where: {
          treeId,
        },
      });
      if (maxSequence?._max?.sequence >= 0) newSequence = maxSequence?._max?.sequence + 1;
      image.sequence = newSequence;
    }

    upsertArgs.create.images = { create: { ...image } };
    upsertArgs.update.images = { upsert: [{ create: { ...image }, update: image, where: { uuid: image.uuid } }] };
  }

  const upsertedTree = await prisma.tree.upsert(upsertArgs);
  return upsertedTree;
}

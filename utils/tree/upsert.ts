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

  //const image = (tree.images?.length > 0 && tree.images[0]) as TreeImage;

  if (tree.pictureUrl && !tree.images?.length) {
    tree.images = [{ url: tree.pictureUrl, uuid: 'temp' }];
  }

  if (tree.images) {
    let newSequence = 0;

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
      //image.sequence = newSequence;
    }
    console.log('tree.images.length', tree.images.length);

    let imageCount = 0;

    for (let i = 0; i < tree.images.length; i++) {
      const image = tree.images[i];
      const pictureUrl = image.url;

      if (pictureUrl && !pictureUrl.startsWith('http')) {
        if (!image.uuid || image.uuid === 'temp') image.uuid = uuidv4();
        const imagePath = getTreeImagePath(image.uuid);
        const newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;
        if (imageCount === 0) {
          tree.pictureUrl = newUrl;
          upsertArgs.create.pictureUrl = newUrl;
          upsertArgs.update.pictureUrl = newUrl;
        }
        image.url = newUrl;
        uploadTreeImages(pictureUrl, image.uuid);
        if (!treeId && image.sequence === undefined) {
          image.sequence = newSequence + imageCount;
        }
      } else if (!image.uuid) {
        tree.images.splice(i, 1);
        i--;
      }
      imageCount++;
    }
    /*
    const data: Prisma.Enumerable<Prisma.TreeImageCreateManyTreeInput> = tree.images as Prisma.TreeImageCreateManyTreeInput[];

    upsertArgs.create.images = {
      createMany: {
        data,
      },
    };
    tree.images.map(img => {
          return { ...img };
        }),
    upsertArgs.update.images = { upsert: [{ create: { ...image }, update: image, where: { uuid: image.uuid } }] };*/
  }

  console.log('upsertArgs', upsertArgs);
  const upsertedTree = (await prisma.tree.upsert(upsertArgs)) as PartialTree;

  if (tree.images) {
    await Promise.all(
      tree.images.map(image => {
        image.treeId = upsertedTree.id;
        return prisma.treeImage.upsert({ create: image as TreeImage, update: image, where: { uuid: image.uuid } });
      }),
    );
    upsertedTree.images = tree.images;
  }

  return upsertedTree;
}

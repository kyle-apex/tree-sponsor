import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getAvailableSponsorships } from 'utils/prisma/get-available-sponsorships';
import { prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';

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

    let treeQuery = undefined;

    const treeId = tree.id;

    // remove id if it's 0 for the upsert to work correctly
    delete tree.id;

    if (!treeId) {
      tree.createdDate = new Date();
    }
    tree.edit = { connect: { id: userId } };

    if (!sponsorship.primaryImageUuid) {
      sponsorship.primaryImageUuid = uuidv4();
    }

    const imageData = {
      uuid: sponsorship.primaryImageUuid,
      width: sponsorship.primaryImageWidth,
      height: sponsorship.primaryImageHeight,
    };

    const tree = sponsorship.tree;

    if (tree?.id || tree?.latitude) {
      treeQuery = {
        connectOrCreate: {
          where: { id: tree.id || -1 },
          create: {
            latitude: tree.latitude as number,
            longitude: tree.longitude as number,
          },
        },
      };
    }

    const imageUrl = sponsorship?.imageUrl;

    delete sponsorship.imageUrl;
    delete sponsorship.imageFile;
    delete sponsorship.tree;

    // if height is 0, we do not want to update it
    if (sponsorship.primaryImageHeight === 0) {
      delete sponsorship.primaryImageHeight;
      delete sponsorship.primaryImageWidth;
    }

    if (imageUrl && !imageUrl.includes('http')) {
      const imagePath = getTreeImagePath(sponsorship.primaryImageUuid);
      sponsorship.pictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagePath}/small`;

      uploadTreeImages(imageUrl, sponsorship.primaryImageUuid);
    }

    t2 = new Date().getTime();
    const upsertedSponsorship = await prisma.sponsorship.upsert({
      where: { id: sponsorshipId || -1 },
      create: {
        ...sponsorship,
        tree: treeQuery,
        images: { create: imageData },
      },
      update: {
        ...sponsorship,
        tree: treeQuery,
        images: { upsert: [{ create: imageData, update: imageData, where: { uuid: imageData.uuid } }] },
      },
    });
    console.log('after upsert', new Date().getTime() - t2);
    res.status(200).json(upsertedSponsorship);
  }
}

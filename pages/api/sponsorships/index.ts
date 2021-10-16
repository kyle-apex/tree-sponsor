import { NextApiRequest, NextApiResponse } from 'next';
import { Sponsorship } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getAvailableSponsorships } from 'utils/prisma/get-available-sponsorships';
import uploadImage from 'utils/aws/upload-image';
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
  let t2 = new Date().getTime();
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  console.log('before', new Date().getTime() - t2);
  if (req.method === 'POST') {
    t2 = new Date().getTime();
    const sponsorship = req.body;

    if (!sponsorship) return throwError(res, 'Please submit new sponsorship data.');

    let treeQuery = undefined;

    if (!sponsorship.reviewStatus) sponsorship.reviewStatus = 'Draft';

    if ((sponsorship.tree?.latitude || sponsorship.treeId) && sponsorship.imageUrl && sponsorship.reviewStatus === 'Draft')
      sponsorship.reviewStatus = 'New';

    const sponsorshipId = sponsorship.id;

    // remove id if it's 0 for the upsert to work correctly
    delete sponsorship.id;

    if (!sponsorshipId) {
      const availableSponsorships = await getAvailableSponsorships(userId, 1);

      if (availableSponsorships?.length < 1) return throwError(res, 'You do not have any more available sponsorships!');
      const subscription = availableSponsorships[0];
      subscription.lastPaymentDate.setFullYear(subscription.lastPaymentDate.getFullYear() + 1);
      sponsorship.expirationDate = subscription.lastPaymentDate;
      sponsorship.startDate = new Date();
      sponsorship.Subscription = { connect: { id: subscription.id } };
    }
    sponsorship.user = { connect: { id: userId } };

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

    console.log('before upsert', new Date().getTime() - t2);
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

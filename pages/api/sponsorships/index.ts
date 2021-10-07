import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Sponsorship } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { hasAvailableSponsorship } from 'utils/prisma/has-available-sponsorship';
import { getAvailableSponsorships } from 'utils/prisma/get-available-sponsorships';
import uploadImage from 'utils/aws/upload-image';
import { listenerCount } from 'process';

const prisma = new PrismaClient();

function getSponsorImageKey(userId: number, sponsorship: Sponsorship) {
  return `${userId}/${sponsorship.subscriptionId}/tree`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'POST') {
    const sponsorship = req.body;

    if (!sponsorship) return throwError(res, 'Please submit new sponsorship data.');

    let treeQuery = undefined;

    if (!sponsorship.reviewStatus) sponsorship.reviewStatus = 'Draft';

    if (!sponsorship.id) {
      const availableSponsorships = await getAvailableSponsorships(userId, 1);

      if (availableSponsorships?.length < 1) return throwError(res, 'You do not have any more available sponsorships!');
      const subscription = availableSponsorships[0];
      subscription.lastPaymentDate.setFullYear(subscription.lastPaymentDate.getFullYear() + 1);
      sponsorship.expirationDate = subscription.lastPaymentDate;
      sponsorship.startDate = new Date();
      sponsorship.Subscription = { connect: { id: subscription.id } };
    }
    sponsorship.user = { connect: { id: userId } };

    if (sponsorship?.imageUrl) {
      const imageUrl = sponsorship?.imageUrl;
      const uploadedURL = await uploadImage(
        imageUrl.split(',')[1],
        imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')),
        getSponsorImageKey(userId, sponsorship),
      );

      delete sponsorship.imageUrl;

      sponsorship.pictureUrl = uploadedURL;
    }

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

    delete sponsorship.imageFile;
    delete sponsorship.tree;

    const prismaQuery = {
      where: { id: sponsorship.id || -1 },
      create: {
        ...sponsorship,
        tree: treeQuery,
      },
      update: {
        ...sponsorship,
        tree: treeQuery,
      },
    };

    console.log('prismaQuery', prismaQuery);

    const result = await prisma.sponsorship.upsert(prismaQuery);
    res.status(200).json(result);
  }
}

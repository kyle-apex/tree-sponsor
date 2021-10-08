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

    const prismaQuery = {
      where: { id: sponsorshipId || -1 },
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

    const upsertedSponsorship = await prisma.sponsorship.upsert(prismaQuery);

    if (imageUrl && !imageUrl.includes('http')) {
      const uploadedURL = await uploadImage(
        imageUrl.split(',')[1],
        imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')),
        getSponsorImageKey(userId, upsertedSponsorship),
      );

      await prisma.sponsorship.update({ where: { id: upsertedSponsorship.id }, data: { pictureUrl: uploadedURL } });
    }

    res.status(200).json(upsertedSponsorship);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Sponsorship } from '@prisma/client';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { hasAvailableSponsorship } from 'utils/prisma/has-available-sponsorship';
import { getAvailableSponsorships } from 'utils/prisma/get-available-sponsorships';
import uploadImage from 'utils/aws/upload-image';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('idex');
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'POST') {
    const sponsorship = req.body;

    if (!sponsorship) return throwError(res, 'Please submit new sponsorship data.');

    const availableSponsorships = await getAvailableSponsorships(userId, 1);

    if (availableSponsorships?.length < 1) return throwError(res, 'You do not have any more available sponsorships!');

    const tree = sponsorship.tree;

    if (tree) {
      if (tree.id) {
        sponsorship.treeId = tree.id;
      } else if (tree.latitude) {
        const newTree = await prisma.tree.create({
          data: {
            latitude: tree.latitude as number,
            longitude: tree.longitude as number,
          },
        });
        sponsorship.treeId = newTree.id;
      }
      delete sponsorship.tree;
    }

    sponsorship.userId = userId;

    const subscription = availableSponsorships[0];
    subscription.lastPaymentDate.setFullYear(subscription.lastPaymentDate.getFullYear() + 1);
    sponsorship.expirationDate = subscription.lastPaymentDate;
    sponsorship.startDate = new Date();
    sponsorship.subscriptionId = subscription.id;

    console.log('creating sponsorship', sponsorship);

    function getSponsorImageKey(userId: number, sponsorship: Sponsorship) {
      return `${userId}/${sponsorship.subscriptionId}/tree`;
    }

    const uploadedURL = await uploadImage(
      sponsorship.imageFile.content,
      sponsorship.imageFile.type,
      getSponsorImageKey(userId, sponsorship),
    );

    sponsorship.pictureUrl = uploadedURL;

    delete sponsorship.imageFile;

    const newSponsorship = await prisma.sponsorship.create({ data: sponsorship });
    res.status(200).json(newSponsorship);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'utils/auth/get-session';
import { SubscriptionWithDetails, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
  });

  //console.log('subscriptionWithDetails', subscriptionWithDetails);

  res.status(200).json(subscriptionWithDetails);
}

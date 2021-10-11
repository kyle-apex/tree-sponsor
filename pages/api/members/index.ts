import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  //console.log('subscriptionWithDetails', subscriptionWithDetails);

  res.status(200).json(subscriptionWithDetails);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  //console.log('subscriptionWithDetails', subscriptionWithDetails);

  res.status(200).json(subscriptionWithDetails);
}

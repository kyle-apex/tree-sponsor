import { PinpointEmail } from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;

  if (!email) throwError(res, 'No email provided.');

  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findFirst({
    where: { email: email },
    orderBy: { lastPaymentDate: 'desc' },
  });

  await updateSubscriptionsForUser(email);

  console.log('subscriptionWithDetails', subscriptionWithDetails);

  res.status(200).json(subscriptionWithDetails);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { upsertSubscriptions } from 'utils/prisma/upsert-subscriptions';
import { findAllSubscriptions } from 'utils/stripe/find-all-subscriptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await upsertSubscriptions(await findAllSubscriptions());
  res.status(200).json({});
}

import { updateUser } from 'utils/prisma/update-user';
import { NextApiRequest, NextApiResponse } from 'next';
import { upsertSubscriptions } from 'utils/prisma/upsert-subscriptions';
import { getSession } from 'utils/auth/get-session';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { findAllSubscriptionsForUser } from 'utils/stripe/find-all-subscriptions-for-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  console.log('doing refresh', session);
  if (!session?.user?.id) return throwUnauthenticated(res);

  if (req.method === 'POST') {
    await upsertSubscriptions(await findAllSubscriptionsForUser(session?.user?.email));
    res.status(200).json({});
  }
}

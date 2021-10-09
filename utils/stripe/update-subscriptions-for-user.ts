import { upsertSubscriptions } from 'utils/prisma/upsert-subscriptions';
import { findAllSubscriptionsForUser } from './find-all-subscriptions-for-user';

export const updateSubscriptionsForUser = async (email: string) => {
  await upsertSubscriptions(await findAllSubscriptionsForUser(email));
};

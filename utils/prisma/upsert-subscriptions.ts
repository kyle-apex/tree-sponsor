import { PartialSubscription } from 'interfaces';
import { upsertSubscription } from 'utils/prisma/upsert-subscription';

export const upsertSubscriptions = async (subscriptions: PartialSubscription[]): Promise<void> => {
  Promise.all(
    subscriptions.map(async (subscription: PartialSubscription) => {
      await upsertSubscription(subscription);
    }),
  );
};

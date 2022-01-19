import { User } from '.prisma/client';
import { PartialSubscription } from 'interfaces';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';

export const upsertSubscription = async (subscription: PartialSubscription): Promise<void> => {
  console.log('upserting', subscription.stripeId, subscription.lastPaymentDate);
  await prisma.subscription.upsert({
    where: { stripeId: subscription.stripeId },
    create: {
      stripeId: subscription.stripeId,
      stripeCustomerId: subscription.stripeCustomerId,
      status: subscription.status,
      createdDate: subscription.createdDate,
      lastPaymentDate: subscription.lastPaymentDate,
      product: {
        connectOrCreate: {
          where: { stripeId: subscription.product.stripeId },
          create: {
            stripeId: subscription.product.stripeId,
            name: subscription.product.name,
            amount: subscription.product.amount,
          },
        },
      },
      user: {
        connectOrCreate: {
          where: { email: subscription.user.email },
          create: {
            email: subscription.user.email,
            name: subscription.user.name,
            stripeCustomerId: subscription.stripeCustomerId,
            profilePath: generateProfilePath(subscription.user as User),
          },
        },
      },
    },
    update: {
      status: subscription.status,
      createdDate: subscription.createdDate,
      lastPaymentDate: subscription.lastPaymentDate,
      product: {
        connectOrCreate: {
          where: { stripeId: subscription.product.stripeId },
          create: {
            stripeId: subscription.product.stripeId,
            name: subscription.product.name,
            amount: subscription.product.amount,
          },
        },
      },
      user: {
        connectOrCreate: {
          where: { email: subscription.user.email },
          create: {
            email: subscription.user.email,
            name: subscription.user.name,
            stripeCustomerId: subscription.stripeCustomerId,
            profilePath: generateProfilePath(subscription.user as User),
          },
        },
      },
    },
  });
};

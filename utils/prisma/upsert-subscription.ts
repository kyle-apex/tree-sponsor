import { PartialSubscription } from 'interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const upsertSubscription = async (subscription: PartialSubscription): Promise<void> => {
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
          },
        },
      },
    },
  });
};
import { User } from '.prisma/client';
import { PartialSubscription } from 'interfaces';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export const upsertSubscription = async (subscription: PartialSubscription): Promise<void> => {
  const existingUser = subscription.user?.email ? await getUserByEmail(subscription.user.email) : null;

  if (subscription.lastPaymentDate) {
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
            where: { email: existingUser?.email || subscription.user.email },
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
            where: { email: existingUser?.email || subscription.user.email },
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
  }
  if (subscription.user?.name)
    await prisma.user.updateMany({
      where: { email: existingUser?.email || subscription.user.email, name: null },
      data: { name: subscription.user.name },
    });
  if (!existingUser?.referralUserId && subscription.stripeCustomer?.metadata && subscription.stripeCustomer?.metadata['Found From']) {
    const foundFrom = subscription.stripeCustomer?.metadata['Found From'].toLowerCase();
    const firstWord = foundFrom?.split(' ')[0];

    const allUsers = await prisma.user.findMany({ select: { id: true, name: true, displayName: true } });
    let referringUser;
    for (const user of allUsers || []) {
      const lowerName = user.name?.toLowerCase();
      if (lowerName && foundFrom.includes(lowerName)) {
        referringUser = user;
        break;
      }
    }
    if (!referringUser)
      for (const user of allUsers || []) {
        const lowerDisplayName = user.displayName?.toLowerCase();
        if (lowerDisplayName && foundFrom.includes(lowerDisplayName)) {
          referringUser = user;
          break;
        }
      }

    if (!referringUser) {
      const matchingUsers = allUsers.filter(user => {
        return user.name?.toLowerCase().split(' ')[0] == firstWord;
      });
      if (matchingUsers.length === 1) referringUser = matchingUsers[0];
    }

    if (referringUser?.id) {
      await prisma.user.updateMany({
        where: { email: existingUser?.email || subscription.user.email, referralUserId: null },
        data: { referralUserId: referringUser.id },
      });
    }
  }
  if (subscription.stripeCustomerId)
    await prisma.user.updateMany({
      where: { email: existingUser?.email || subscription.user.email, stripeCustomerId: null },
      data: { stripeCustomerId: subscription.stripeCustomerId },
    });
};

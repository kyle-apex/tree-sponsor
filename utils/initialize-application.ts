import { upsertSubscriptions } from './prisma/upsert-subscriptions';
import { findAllSubscriptions } from './stripe/find-all-subscriptions';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export default async function initializeApplication() {
  // for some reason, full population requires calling this twice
  const t1 = new Date().getTime();
  await upsertSubscriptions(await findAllSubscriptions());
  console.log('upsert total time', new Date().getTime() - t1);
  await upsertSubscriptions(await findAllSubscriptions());

  const ownerEmails: string[] = process.env.ownerEmails ? process.env.ownerEmails.split(',') : ['kyle@kylehoskins.com'];
  /*const emailQuery: any[] = [];
  adminEmails.forEach(email => {
    emailQuery.push({ email });
  });*/

  let ownerRole = await prisma.role.findFirst({ where: { name: 'Owner' } });
  console.log('first owner role', ownerRole, ownerEmails);

  if (!ownerRole)
    ownerRole = await prisma.role.create({
      data: {
        name: 'Owner',
        hasAuthManagement: true,
        isAdmin: true,
      },
    });

  await Promise.all(
    ownerEmails.map((email: string) => {
      console.log('update email', email, ownerRole);
      return prisma.user.update({
        where: {
          email: email,
        },
        data: {
          roles: {
            connect: { id: ownerRole.id },
          },
        },
      });
    }),
  );

  try {
    await prisma.$executeRaw(`DROP Table SubscriptionWithDetails`);
  } catch (err) {
    console.log('SubscriptionWithDetails table was previously removed');
  }

  try {
    await prisma.$executeRaw(`CREATE VIEW SubscriptionWithDetails AS
  SELECT
      s.id,
      s.status,
      s.stripeCustomerId,
      p.stripeId as stripeProductId,
      s.stripeId,
      s.productId,
      p.name as productName,
      p.amount as amount,
      p.stripeId as productStripeId,
      u.id as userId,
      u.name as userName,
      u.email as email,
      u.hasShirt,
      s.createdDate,
      s.lastPaymentDate,
      s.expirationDate
  FROM
      Subscription s,
      users u,
      Product p
  where
      s.userId = u.id
      and p.id = s.productId
      and (
          p.name like '%TFYP%'
          or p.name like '%Young Profess%'
          or p.name like '%Membership%'
      )
      and amount >= 20`);
  } catch (err) {
    console.log('SubscriptionWithDetails already exists');
  }
}

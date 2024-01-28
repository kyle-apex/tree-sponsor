import { prisma } from 'utils/prisma/init';

export default async function fixSubscriptionWithDetailsView() {
  try {
    await prisma.$executeRaw`DROP Table SubscriptionWithDetails`;
  } catch (err) {
    console.log('SubscriptionWithDetails table was previously removed');
  }

  try {
    await prisma.$executeRaw`CREATE OR REPLACE VIEW SubscriptionWithDetails AS
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
      u.email2 as email2,
      u.hasShirt,
      u.referralUserId,
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
      and amount >= 20`;
  } catch (err) {
    console.log('SubscriptionWithDetails already exists');
  }
}

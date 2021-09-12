import { PrismaClient, Subscription } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAvailableSponsorships(userId: number, count?: number): Promise<Subscription[]> {
  const currentSponsorships = await prisma.sponsorship.findMany({
    where: { userId: userId, expirationDate: { gt: new Date() } },
  });
  console.log('currentSponsorships', currentSponsorships);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const currentSubscriptions = await prisma.subscription.findMany({
    where: { userId: userId, lastPaymentDate: { gt: oneYearAgo }, status: 'active' },
    include: { sponsorships: { where: { expirationDate: { gt: new Date() } } } },
    orderBy: { lastPaymentDate: 'desc' },
    take: count ?? 100000,
  });
  console.log('currentSubscriptions', currentSubscriptions);
  console.log('userId', userId);

  return currentSubscriptions;
}

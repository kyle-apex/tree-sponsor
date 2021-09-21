import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function hasAvailableSponsorship(userId: number): Promise<boolean> {
  const currentSponsorships = await prisma.sponsorship.findMany({
    where: { userId: userId, expirationDate: { gt: new Date() } },
  });
  //console.log('currentSponsorships', currentSponsorships);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const currentSubscriptions = await prisma.subscription.findMany({
    where: { userId: userId, lastPaymentDate: { gt: oneYearAgo }, status: 'active' },
  });
  //console.log('currentSubscriptions', currentSubscriptions);
  //console.log('userId', userId);

  return currentSponsorships.length < currentSubscriptions.length;
}

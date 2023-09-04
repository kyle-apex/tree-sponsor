import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma, Prisma } from 'utils/prisma/init';
import { ReferralStats } from 'interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;

  if (req.method === 'GET') {
    const stats: ReferralStats = {
      numberOfDonations: 0,
      amountOfDonations: 0,
      referrals: [],
    };

    const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
      where: { referralUserId: userId },
      distinct: ['email'],
      orderBy: { createdDate: 'desc' },
    });

    const referralNames: string[] = [];

    stats.amountOfDonations = subscriptionWithDetails.reduce((previous, current) => {
      if (!stats.referrals.find(ref => ref.name == current.userName))
        stats.referrals.push({ name: current.userName, status: current.status });

      const latestYear = current.lastPaymentDate?.getFullYear();
      const firstYear = current.createdDate?.getFullYear();
      let totalYears = 1;
      if (latestYear && firstYear && latestYear != firstYear) {
        totalYears = latestYear - firstYear + 1;
      }
      stats.numberOfDonations += totalYears;
      const total = previous + current.amount * totalYears;
      return total;
    }, 0);

    res.status(200).json(stats);
  }
}

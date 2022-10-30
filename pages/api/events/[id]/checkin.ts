import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { prisma, Prisma } from 'utils/prisma/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.id);
  const email = String(req.query.email);
  if (req.method === 'GET') {
    let subscription;
    const user = await prisma.user.findFirst({ where: { email } });
    const userId = user?.id;
    prisma.checkIn.create({
      data: {
        eventId,
        userId,
        email,
      },
    });

    const checkins = prisma.checkIn.findMany({ where: { eventId }, include: { user: { select: { id: true, name: true, image: true } } } });
    const checkInCount = (await checkins).length;
    const attendees = (await checkins)
      .filter(checkin => checkin.user)
      .map(checkIn => {
        return checkIn.user;
      });

    if (user) {
      await updateSubscriptionsForUser(email);

      subscription = await prisma.subscriptionWithDetails.findFirst({
        where: { email: email },
        orderBy: { lastPaymentDate: 'desc' },
      });
    }
    res.status(200).json({ subscription, checkInCount, attendees });
  }
}

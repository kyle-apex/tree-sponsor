import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized) {
      return throwError(res, 'Access denied');
    }
    const userId = Number(req.query.userId);
    const eventId = Number(req.query.eventId);

    if (!eventId || !userId) return throwError(res, 'Invalid input');

    const event = await prisma.eventCheckIn.deleteMany({
      where: { userId, eventId },
    });

    res.status(200).json(event);
  }
}

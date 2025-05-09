import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import throwError from 'utils/api/throw-error';
import { PartialAttendee } from 'interfaces';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const isAdmin = await isCurrentUserAuthorized('hasEventManagement', req);

    // users can only be updated by admins
    if (!isAdmin) {
      return throwError(res, 'Access denied');
    }
    let searchString = req.query.searchString;

    let result: PartialAttendee[];

    if (!searchString)
      result = await prisma.$queryRaw<PartialAttendee[]>`
        SELECT  e.name as eventName, c.eventId as eventId, c.userId as userId, c.emailOptIn as "emailOptIn", u.name, u.email, c.discoveredFrom, c.id as "checkinId", c.createdDate, CASE WHEN s.lastPaymentDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN 1 ELSE 0 END as "isMember"
        FROM Event e,EventCheckIn c, users u
        LEFT OUTER JOIN (SELECT userId, MAX(lastPaymentDate) as lastpaymentdate FROM Subscription GROUP BY userId) s on u.id=s.userId
        WHERE  c.userId=u.id and e.id=c.eventId order by c.createdDate desc`;
    else {
      searchString = '%' + searchString + '%';
      result = await prisma.$queryRaw<PartialAttendee[]>`
            SELECT  e.name as eventName, c.eventId as eventId, c.userId as userId, c.emailOptIn as "emailOptIn", u.name, u.email, c.discoveredFrom, c.id as "checkinId", c.createdDate, CASE WHEN s.lastPaymentDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN 1 ELSE 0 END as "isMember"
            FROM Event e,EventCheckIn c, users u
            LEFT OUTER JOIN (SELECT userId, MAX(lastPaymentDate) as lastpaymentdate FROM Subscription GROUP BY userId) s on u.id=s.userId
            WHERE  c.userId=u.id and e.id=c.eventId and (e.name LIKE ${searchString} or u.name LIKE ${searchString} or u.email LIKE ${searchString})  order by c.createdDate desc`;
    }

    // Convert any BigInt values to strings before sending the response
    for (const row of (result as any[]) || []) {
      for (const nam in row) {
        if (typeof row[nam as keyof PartialAttendee] === 'bigint') {
          console.log('BigInt found in row:', nam, row[nam]);
          row[nam] = row[nam as keyof PartialAttendee].toString();
        }
      }
    }

    // Convert any BigInt values to strings before sending the response

    res.status(200).json(result);
  }
}

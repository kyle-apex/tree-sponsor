import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import throwError from 'utils/api/throw-error';
import { PartialAttendee } from 'interfaces';
import { prisma } from 'utils/prisma/init';

/**
 * Recursively converts BigInt values to strings in an object or array
 * @param obj The object or array to process
 * @returns A new object or array with BigInt values converted to strings
 */
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = convertBigIntToString(obj[key]);
    }
    return result;
  }

  return obj;
}

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
        SELECT  e.name as eventName, CAST(c.eventId AS CHAR) as eventId, CAST(c.userId AS CHAR) as userId, c.emailOptIn as "emailOptIn", u.name, u.email, c.discoveredFrom, CAST(c.id AS CHAR) as "checkinId", c.createdDate, CASE WHEN s.lastPaymentDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN true ELSE false END as "isMember"
        FROM Event e,EventCheckIn c, users u
        LEFT OUTER JOIN (SELECT userId, MAX(lastPaymentDate) as lastpaymentdate FROM Subscription GROUP BY userId) s on u.id=s.userId
        WHERE  c.userId=u.id and e.id=c.eventId order by c.createdDate desc`;
    else {
      searchString = '%' + searchString + '%';
      result = await prisma.$queryRaw<PartialAttendee[]>`
            SELECT  e.name as eventName, CAST(c.eventId AS CHAR) as eventId, CAST(c.userId AS CHAR) as userId, c.emailOptIn as "emailOptIn", u.name, u.email, c.discoveredFrom, CAST(c.id AS CHAR) as "checkinId", c.createdDate, CASE WHEN s.lastPaymentDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN true ELSE false END as "isMember"
            FROM Event e,EventCheckIn c, users u
            LEFT OUTER JOIN (SELECT userId, MAX(lastPaymentDate) as lastpaymentdate FROM Subscription GROUP BY userId) s on u.id=s.userId
            WHERE  c.userId=u.id and e.id=c.eventId and (e.name LIKE ${searchString} or u.name LIKE ${searchString} or u.email LIKE ${searchString})  order by c.createdDate desc`;
    }

    // Convert any BigInt values to strings before sending the response
    const safeResult = convertBigIntToString(result);
    res.status(200).json(safeResult);
  }
}

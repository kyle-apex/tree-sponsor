import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { getYearDateRange } from 'utils/get-year-date-range';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('isAdmin', req))) return;

  if (req.method === 'GET') {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    const { startDate, endDate } = getYearDateRange(year);

    const donations = await prisma.donation.findMany({
      orderBy: { date: 'asc' },
      where: { date: { gt: startDate, lt: endDate } },
    });
    res.status(200).json(donations);
  } else if (req.method === 'POST') {
    const donation = await prisma.donation.create({ data: req.body });
    res.status(200).json(donation);
  }
}

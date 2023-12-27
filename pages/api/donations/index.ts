import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { getYearDateRange } from 'utils/get-year-date-range';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCurrentUserAuthorized('isAdmin', req))) return;

  if (req.method === 'GET') {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    const startDateString = req.query.startDate ? String(req.query.startDate) : null;
    const endDateString = req.query.endDate ? String(req.query.endDate) : null;

    let startDate, endDate;

    if (startDateString) {
      startDate = new Date(startDateString);
      if (endDateString) endDate = new Date(endDateString);
    } else {
      const result = getYearDateRange(year);
      startDate = result.startDate;
      endDate = result.endDate;
    }

    const whereFilter: {
      gt?: Date;
      lt?: Date;
    } = { gt: startDate };

    if (endDate) whereFilter.lt = endDate;

    const donations = await prisma.donation.findMany({
      orderBy: { date: 'asc' },
      where: { date: whereFilter },
    });

    res.status(200).json(donations);
  } else if (req.method === 'POST') {
    const donation = await prisma.donation.create({ data: req.body });
    res.status(200).json(donation);
  }
}

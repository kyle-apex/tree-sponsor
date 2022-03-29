import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

type ChartDataResult = {
  labels: string[];
  active: number[];
  inactive: number[];
  total: number[];
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const subscriptionWithDetails = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  const years: number[] = [];
  const dataMap: any = {};

  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  subscriptionWithDetails.forEach(item => {
    const firstYear = item.createdDate.getFullYear();
    if (!years.includes(firstYear)) years.push(firstYear);

    if (!dataMap[firstYear]) {
      dataMap[firstYear] = {
        total: 0,
        active: 0,
        inactive: 0,
      };
    }
    dataMap[firstYear].total++;

    if (item.lastPaymentDate > calendarYear) dataMap[firstYear].active++;
    else dataMap[firstYear].inactive++;
  });

  const labels = years.sort().map(year => year + '');

  const chartData: ChartDataResult = { labels: labels, active: [], inactive: [], total: [] };

  labels.forEach(year => {
    const data = dataMap[year];
    chartData.active.push(data.active);
    chartData.inactive.push(data.inactive);
    chartData.total.push(data.total);
  });

  res.status(200).json(chartData);
}

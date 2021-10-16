import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  for (let i = 0; i < 10; i++) {
    const t2 = new Date().getTime();
    await prisma.sponsorship.findMany({ select: { images: {} } });
    console.log('t2', t2 - new Date().getTime());
  }
  for (let i = 0; i < 10; i++) {
    const t2 = new Date().getTime();
    await prisma.sponsorship.findMany({});
    console.log('t3', t2 - new Date().getTime());
  }

  res.status(200).json('Initialized');
}

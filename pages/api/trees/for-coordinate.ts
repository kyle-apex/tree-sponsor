import { PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import listTreesForCoordinate from 'utils/tree/list-trees-for-location';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (req.method === 'GET') {
    let userId = session?.user?.id;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const distance = req.query.distance;
    const email = String(req.query.email);

    if (email && !userId) {
      const user = (await prisma.user.findFirst({ where: { email } })) as PartialUser;
      userId = user?.id;
    }

    const trees = await listTreesForCoordinate(Number(latitude), Number(longitude), Number(distance), userId);
    res.status(200).json(trees);
  }
}

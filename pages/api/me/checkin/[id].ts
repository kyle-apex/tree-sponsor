import { PartialEventCheckIn, PartialTree } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const checkinId = Number(req.query.id);

  //const session = await getSession({ req });

  //if (!session?.user?.id) return throwUnauthenticated(res);

  //const userId = session.user.id;

  if (req.method == 'PATCH') {
    if (checkinId) await prisma.eventCheckIn.update({ where: { id: checkinId }, data: req.body });
    //const checkin = await prisma.eventCheckIn.findFirst({ where: { id: checkinId, userId } });

    // if (checkin) {
    //await prisma.eventCheckIn.update({ where: { id: checkinId }, data: req.body });
    //}

    res.status(200).json({});
  }
}

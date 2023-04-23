import { PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    let userId;

    userId = session?.user?.id;

    if (!userId) {
      const user = (await prisma.user.findFirst({ where: { email: req.body.email } })) as PartialUser;
      userId = user?.id;
    }

    delete req.body.email;

    const data = { ...req.body, userId };

    const obj = await prisma.speciesQuizResponse.create({ data });
    res.status(200).json(obj);
  }
}

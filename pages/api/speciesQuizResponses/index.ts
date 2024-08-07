import { PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    let userId;

    userId = session?.user?.id;
    const email = req.body.email;

    if (!userId) {
      const user = await getUserByEmail(email);
      userId = user?.id;
    }

    if (!userId && email && /.+@.+\..+/.test(email)) {
      // create user?
      const newUser = await prisma.user.create({ data: { email } });
      userId = newUser?.id;
    }

    if (!userId) return throwUnauthenticated(res);

    delete req.body.email;

    const data = { ...req.body, userId };

    const obj = await prisma.speciesQuizResponse.create({ data });
    res.status(200).json(obj);
  }
}

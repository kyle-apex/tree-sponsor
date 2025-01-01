import { Form } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  const formId = Number(req.query.id);

  if (req.method === 'GET') {
    const result = await prisma.formResponse.findFirst({ where: { formId, userId } });
    res.status(200).json(result);
  } else if (req.method === 'PATCH') {
    /*
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized && userId) {
      const event = await prisma.form.findFirst({
        where: { createdByUserId: id },
      });
      if (event) isAuthorized = true;
    }
    const formBody = req.body as Form;

    const result = await prisma.form.update({ where: { id: formBody.id }, data: { ...formBody } });
    if (isAuthorized) res.status(200).json(result);*/
  }
}

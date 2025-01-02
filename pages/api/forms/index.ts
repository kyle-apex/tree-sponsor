import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import { prisma } from 'utils/prisma/init';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { Form } from '@prisma/client';
import randomString from 'utils/data/random-string';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (req.method === 'POST') {
    const formBody = req.body as Form;

    formBody.createdByUserId = session?.user?.id;

    const isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized) {
      return throwError(res, 'Access denied');
    }

    if (!formBody.path) formBody.path = randomString(8);

    const newForm = await prisma.form.create({ data: { ...formBody, id: undefined } });
    res.status(200).json(newForm);
  } else if (req.method == 'GET') {
    const forms = await prisma.form.findMany({ include: { formResponses: { select: { userId: true } } } });
    res.status(200).json(forms);
  }
}

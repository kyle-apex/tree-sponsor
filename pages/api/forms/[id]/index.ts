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
  const id = Number(req.query.id);

  if (req.method === 'DELETE') {
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized && userId) {
      const event = await prisma.form.findFirst({
        where: { createdByUserId: id },
      });
      if (event) isAuthorized = true;
    }
    if (isAuthorized) {
      // Implement soft delete by setting deletedAt instead of deleting the record
      const result = await prisma.form.update({
        where: { id: id },
        data: { deletedAt: new Date() } as any,
      });
      res.status(200).json(result);
    }
  } else if (req.method === 'GET') {
    const isAuthorized = await isCurrentUserAuthorized('hasFormManagement', req);

    const result = await prisma.form.findFirst({
      where: { id: Number(req.query.id) },
      include: { formResponses: isAuthorized ? { include: { user: {} }, orderBy: { createdDate: 'asc' } } : false },
    });
    res.status(200).json(result);
  } else if (req.method === 'PATCH') {
    let isAuthorized = await isCurrentUserAuthorized('isAdmin', req);

    if (!isAuthorized && userId) {
      const event = await prisma.form.findFirst({
        where: { createdByUserId: id },
      });
      if (event) isAuthorized = true;
    }
    const formBody = req.body as Form;

    const result = await prisma.form.update({ where: { id: formBody.id }, data: { ...formBody } });
    if (isAuthorized) res.status(200).json(result);
  }
}

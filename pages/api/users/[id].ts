import { updateUser } from 'utils/prisma/update-user';
import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import throwError from 'utils/api/throw-error';
import { getSession } from 'utils/auth/get-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'PATCH') {
    const isAdmin = await isCurrentUserAuthorized('isAdmin', req);

    // users can only be updated by admins
    if (!isAdmin) {
      //const session = await getSession({ req });
      //if (!session?.user?.id || session.user.id != id)
      return throwError(res, 'Access denied');
    }

    const result = await updateUser(id, req.body);
    res.status(200).json(result);
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import throwError from 'utils/api/throw-error';
import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  // Only allow PUT or PATCH methods
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const id = Number(req.query.id);

  // Ensure only authorized admins can restore forms
  const isAuthorized = await isCurrentUserAuthorized('isAdmin', req);
  if (!isAuthorized) {
    return throwError(res, 'Access denied');
  }

  try {
    // Restore the form by setting deletedAt to null
    const result = await prisma.form.update({
      where: { id },
      data: { deletedAt: null } as any,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error restoring form:', error);
    res.status(500).json({ message: 'Error restoring form', error });
  }
}

import { NextApiRequest } from 'next';
import { AccessType } from './AccessType';
import { getSession } from './get-session';
import hasAccess from './has-access';

export async function isCurrentUserAuthorized(accessType: AccessType, req?: NextApiRequest): Promise<boolean> {
  const session = await getSession({ req });
  console.log('session userId', session.userId);

  if (!session?.user?.id) return false;

  return hasAccess(session.user.id, accessType);
}

import { AccessType } from './AccessType';
import { getSession } from './get-session';
import hasAccess from './has-access';

export async function isCurrentUserAuthorized(accessType: AccessType): Promise<boolean> {
  const session = await getSession();

  if (!session?.userId) return false;

  return hasAccess(session.userId, accessType);
}

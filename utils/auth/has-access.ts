import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';
import { AccessType } from './AccessType';

export default async function hasAccess(userId: number, accessType: AccessType): Promise<boolean> {
  return await hasAccessForQueriedUser({ id: userId }, accessType);
}

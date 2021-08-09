import { PrismaClient } from '@prisma/client';
import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';
import { AccessType } from './AccessType';

const prisma = new PrismaClient();

export default async function hasAccess(userId: number, accessType: AccessType): Promise<boolean> {
  return await hasAccessForQueriedUser({ id: userId }, accessType);
}

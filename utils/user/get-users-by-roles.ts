import { prisma } from 'utils/prisma/init';
import { User } from '@prisma/client';

/**
 * Retrieves users that have any of the specified roles
 * @param roleNames Array of role names to filter users by
 * @returns Array of User objects that have any of the specified roles
 */
export default async function getUsersByRoles(roleNames: string[]): Promise<User[]> {
  //console.log(`[getUsersByRoles] Searching for users with roles: ${roleNames.join(', ')}`);

  try {
    const users = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            name: {
              in: roleNames,
            },
          },
        },
      },
      include: {
        roles: true,
      },
    });

    //console.log(`[getUsersByRoles] Found ${users.length} users with the specified roles`);
    return users;
  } catch (error) {
    //console.error('[getUsersByRoles] Error fetching users by roles:', error);
    throw error;
  }
}

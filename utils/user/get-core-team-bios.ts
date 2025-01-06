import { prisma } from 'utils/prisma/init';
export async function getCoreTeamBios() {
  const users = await prisma.user.findMany({
    where: {
      roles: { some: { name: 'Core Team' } },
      profile: { bio: { not: null } },
      image: { not: null },
      hideFromIndexPage: { not: true },
    },
    select: {
      name: true,
      displayName: true,
      image: true,
      profile: { select: { bio: true, title: true } },
      roles: { select: { name: true } },
      createdAt: true,
    },
  });
  users.forEach(user => {
    user.roles = user.roles?.filter(role => role.name != 'Owner');
  });
  users.sort((a, b) => {
    if (a.roles?.length != b.roles?.length) return a.roles?.length > b.roles?.length ? -1 : 1;
    return a.createdAt < b.createdAt ? -1 : 1;
  });
  users.forEach(user => {
    delete user.createdAt;
    delete user.roles;
  });
  return users;
}

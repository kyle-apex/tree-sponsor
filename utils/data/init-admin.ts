import { prisma, Prisma } from 'utils/prisma/init';
import speciesData from 'utils/data/species.json';

export default async function initAdmin(): Promise<any> {
  const ownerEmails: string[] = process.env.ownerEmails ? process.env.ownerEmails.split(',') : [process.env.GITPOD_GIT_USER_EMAIL];

  if (!ownerEmails) {
    console.log('Please set the env variable "ownerEmails" to set the default admin');
  }

  let ownerRole = await prisma.role.findFirst({ where: { name: 'Owner' } });

  if (!ownerRole)
    ownerRole = await prisma.role.create({
      data: {
        name: 'Owner',
        hasAuthManagement: true,
        isAdmin: true,
        isReviewer: true,
        isTreeReviewer: true,
      },
    });

  const owners = await Promise.all(
    ownerEmails.map((email: string) => {
      console.log('Set email to admin:', email);
      if (!email) return;
      return prisma.user.upsert({
        where: {
          email: email,
        },

        update: {
          roles: {
            connect: { id: ownerRole.id },
          },
        },
        create: {
          email: email,
          roles: {
            connect: { id: ownerRole.id },
          },
        },
      });
    }),
  );
  return owners?.length > 0 ? owners[0] : null;
}

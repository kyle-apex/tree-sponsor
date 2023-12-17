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
        hasShirtManagement: true,
        hasMemberManagement: true,
        hasEventManagement: true
      },
    });
  let coreTeamRole = await prisma.role.findFirst({ where: { name: "Core Team" } });
  if (!coreTeamRole)
    coreTeamRole = await prisma.role.create({ data: { name: "Core Team", isAdmin: true } })
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
            connect: [{ id: ownerRole.id }, { id: coreTeamRole.id }],
          },
        },
        create: {
          email: email,
          image: '/logo-old.png',
          name: process.env.GITPOD_GIT_USER_NAME || 'Application Contributor',
          profile: { create: { bio: 'I help contribute to the TreeFolksYP web application because trees are awesome!' } },
          roles: {
            connect: [{ id: ownerRole.id }, { id: coreTeamRole.id }],
          },
        },
      });
    }),
  );
  return owners?.length > 0 ? owners[0] : null;
}

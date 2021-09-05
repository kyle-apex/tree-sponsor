import { upsertSubscriptions } from './prisma/upsert-subscriptions';
import { findAllSubscriptions } from './stripe/find-all-subscriptions';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export default async function initializeApplication() {
  // for some reason, full population requires calling this twice
  await upsertSubscriptions(await findAllSubscriptions());
  await upsertSubscriptions(await findAllSubscriptions());

  const ownerEmails: string[] = process.env.ownerEmails ? process.env.ownerEmails.split(',') : ['kyle@kylehoskins.com'];
  /*const emailQuery: any[] = [];
  adminEmails.forEach(email => {
    emailQuery.push({ email });
  });*/

  let ownerRole = await prisma.role.findFirst({ where: { name: 'Owner' } });
  console.log('first owner role', ownerRole, ownerEmails);

  if (!ownerRole)
    ownerRole = await prisma.role.create({
      data: {
        name: 'Owner',
        hasAuthManagement: true,
        isAdmin: true,
      },
    });

  await Promise.all(
    ownerEmails.map((email: string) => {
      console.log('update email', email, ownerRole);
      return prisma.user.update({
        where: {
          email: email,
        },
        data: {
          roles: {
            connect: { id: ownerRole.id },
          },
        },
      });
    }),
  );
}

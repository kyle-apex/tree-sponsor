import { NextApiRequest, NextApiResponse } from 'next';
import initializeApplication from 'utils/initialize-application';
import syncActiveMemberGroups from 'utils/mailchimp/sync-active-member-groups';
import syncActiveMemberTags from 'utils/mailchimp/sync-active-member-tags';
import addToGroup from 'utils/tree/add-to-group';
import { updateSpeciesPriority } from 'utils/tree/update-species-priority';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  //await addToGroup();
  const tree = await prisma.tree.findFirst({ where: { id: 120 }, include: { groupLinks: { include: { group: {} } } } });
  console.log('tree', tree);
  res.status(200).json('Tested');
}

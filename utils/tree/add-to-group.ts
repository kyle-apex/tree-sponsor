import { PartialSpecies, PartialSpeciesSuggestion } from 'interfaces';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function addToGroup(): Promise<void> {
  //const what: Prisma.TreeToGroupCreateOrConnectWithoutTreeInput = {};
  const added = await prisma.tree.create({
    data: { name: 'new tree', groupLinks: { create: { name: 'New Hike', group: { create: { name: 'Group name?' } } } } },
  });
  console.log('added', added);
}

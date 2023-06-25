import { prisma, Prisma } from 'utils/prisma/init';

export default async function initDemoData(userId: number) {
  const eventCount = await prisma.event.count();
  if (eventCount != 0) return;

  const demoEvent = await prisma.event.create({
    data: {
      name: 'Summer Solstice Demo',
      startDate: new Date(),
      path: 'summer-solstice-demo',
      location: { create: { name: 'Better Half', latitude: 30.27114, longitude: -97.758657 } },
      user: { connect: { id: userId } },
    },
  });
  const tree1 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
      latitude: 30.27114,
      longitude: -97.758657,
      speciesId: 5483,
      createdByUserId: userId,
    },
  });
  const tree2 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
      latitude: 30.27117,
      longitude: -97.758671,
      speciesId: 7996,
      createdByUserId: userId,
    },
  });
  const tree3 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
      latitude: 30.27117,
      longitude: -97.758695,
      speciesId: 7454,
      createdByUserId: userId,
    },
  });
  const tree4 = await prisma.tree.create({
    data: {
      pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
      latitude: 30.27132,
      longitude: -97.758689,
      speciesId: 6635,
      createdByUserId: userId,
    },
  });

  await prisma.treeImage.createMany({
    data: [
      {
        uuid: 'ad48f002-d9c0-455a-922f-da330611d1e0',
        width: 500,
        height: 667,
        treeId: tree1.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: 'cf51f269-399e-4b75-8369-29cb33337f8f',
        width: 943,
        height: 944,
        treeId: tree1.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/cf51f269-399e-4b75-8369-29cb33337f8f/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: '2219a9ee-d3af-45ce-8e04-c757599b43a7',
        width: 972,
        height: 973,
        treeId: tree2.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/2219a9ee-d3af-45ce-8e04-c757599b43a7/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: 'a67d457a-eb88-4a42-b50a-84a1135fd78f',
        width: 500,
        height: 667,
        treeId: tree2.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: '12a056e3-583b-4370-a07c-896d2dc2a723',
        width: 1114,
        height: 1115,
        treeId: tree3.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/12a056e3-583b-4370-a07c-896d2dc2a723/small',
        sequence: 1,
        isLeaf: true,
      },
      {
        uuid: 'bae023bc-a37f-4fae-bf6d-cab81dd3ada0',
        width: 500,
        height: 375,
        treeId: tree3.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
        sequence: 0,
        isLeaf: false,
      },
      {
        uuid: 'ea0dd8a8-1d1a-40e0-bf44-0da762c17201',
        width: 500,
        height: 494,
        treeId: tree4.id,
        url: 'https://sponsortrees.s3.amazonaws.com/tree-images/ea0dd8a8-1d1a-40e0-bf44-0da762c17201/small',
        sequence: 0,
        isLeaf: false,
      },
    ],
  });
}

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

  const trees = await prisma.tree.createMany({
    data: [
      {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/ad48f002-d9c0-455a-922f-da330611d1e0/small',
        latitude: 30.27114,
        longitude: -97.758657,
        speciesId: 5483,
        createdByUserId: userId,
      },
      {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/a67d457a-eb88-4a42-b50a-84a1135fd78f/small',
        latitude: 30.27117,
        longitude: -97.758671,
        speciesId: 7996,
        createdByUserId: userId,
      },
      {
        pictureUrl: 'https://sponsortrees.s3.amazonaws.com/tree-images/bae023bc-a37f-4fae-bf6d-cab81dd3ada0/small',
        latitude: 30.27117,
        longitude: -97.758695,
        speciesId: 7454,
        createdByUserId: userId,
      },
    ],
  });
}

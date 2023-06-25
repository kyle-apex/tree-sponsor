import { prisma, Prisma } from 'utils/prisma/init';
import speciesData from 'utils/data/species.json';

export default async function initSpecies() {
  const speciesCount = await prisma.species.count();
  if (speciesCount == 0)
    await prisma.species.createMany({
      data: (speciesData as any[]).map(species => {
        species.isInTexas = species.isInTexas == 1;
        species.isNative = species.isNative == 1;
        return species;
      }) as any[],
    });
}

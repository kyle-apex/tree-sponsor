import { PartialSpecies, PartialSpeciesSuggestion } from 'interfaces';
import { prisma } from 'utils/prisma/init';

export default async function getSpeciesIdForSpeciesSuggestion(suggestion: PartialSpeciesSuggestion): Promise<PartialSpecies> {
  console.log('suggestion', suggestion);
  let species = await prisma.species.findFirst({ where: { genus: suggestion.genus, species: suggestion.species } });
  console.log('species', species);
  if (!species) {
    species = await prisma.species.create({
      data: {
        genus: suggestion.genus,
        species: suggestion.species,
        name: suggestion.name,
        commonName: suggestion.commonName || suggestion.name,
      },
    });
    console.log('createdSpecies', species);
  }
  return species;
}

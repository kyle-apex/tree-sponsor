import { PartialSpeciesSuggestion } from 'interfaces';
import capitalizeFirst from 'utils/format/capitalize-first';
import getSpeciesForSpeciesSuggestion from './get-species-for-species-suggestion';

export const identifySuggestions = async (imageContent: string): Promise<PartialSpeciesSuggestion[]> => {
  const apiKey = process.env.PLANT_ID_KEY;
  const plantIdUrl =
    process.env.PLANT_ID_URL || 'https://plant.id/api/v3/identification?details=classification,common_names,inaturalist_id';
  //https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause
  //'https://api.plant.id/v2/identify';

  const data = {
    //api_key: apiKey,
    images: [imageContent],
    // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
    //modifiers: ['crops_medium', 'similar_images'], // crops_simple -> slower, but higher accuracy
    similar_images: true,
    //plant_language: 'en',
    // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
    //plant_details: ['common_names'], //, 'url', 'name_authority', 'taxonomy', 'synonyms'
    longitude: -97.7405213210974,
    latitude: 30.27427678853506,
    //datetime: new Date().toISOString().split('T')[0],
  };
  const t2 = new Date().getTime();

  const response = await fetch(plantIdUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify(data),
  });
  //console.log('response', response);
  console.log('id api time', new Date().getTime() - t2);
  const result = await response.json();

  //console.log('result', result);
  //console.log('result?.result?.classification?.suggestions', result?.result?.classification?.suggestions);
  //console.log('first', JSON.stringify(result?.result?.classification?.suggestions[0]));

  if (result?.result?.classification?.suggestions) {
    const suggestions: PartialSpeciesSuggestion[] = result?.result?.classification?.suggestions.map((suggestion: any) => {
      console.log('suggestion', JSON.stringify(suggestion));
      return {
        id: suggestion.id,
        name: capitalizeFirst(suggestion.name),
        commonName: capitalizeFirst(suggestion.details?.common_names?.length > 0 ? suggestion.details?.common_names[0] : suggestion.name),
        genus: capitalizeFirst(suggestion.name.split(' ')[0]),
        species: suggestion.name.split(' ')[1],
        speciesId: suggestion.speciesId,
        probability: suggestion.probability,
        similarImages: suggestion.similar_images?.map((image: any) => image.url_small),
      } as PartialSpeciesSuggestion;
    });
    for (const suggestion of suggestions) {
      const species = await getSpeciesForSpeciesSuggestion(suggestion);
      suggestion.speciesId = species.id;
      suggestion.name = species.commonName;
    }
    return suggestions;
  }

  return [];
};

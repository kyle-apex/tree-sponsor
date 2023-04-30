import { PartialSpeciesSuggestion } from 'interfaces';
import capitalizeFirst from 'utils/format/capitalize-first';
import getSpeciesForSpeciesSuggestion from './get-species-for-species-suggestion';

export const identifySuggestions = async (imageContent: string): Promise<PartialSpeciesSuggestion[]> => {
  const apiKey = process.env.PLANT_ID_KEY;
  const plantIdUrl = process.env.PLANT_ID_URL || 'https://api.plant.id/v2/identify';

  const data = {
    api_key: apiKey,
    images: [imageContent],
    // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
    modifiers: ['crops_simple', 'similar_images'],
    plant_language: 'en',
    // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
    plant_details: ['common_names'], //, 'url', 'name_authority', 'taxonomy', 'synonyms'
    longitude: -97.7405213210974,
    latitude: 30.27427678853506,
  };
  const t2 = new Date().getTime();

  const response = await fetch(plantIdUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('response', response);
  const result = await response.json();
  console.log('id api time', new Date().getTime() - t2);

  //TO DO - media queries for padding
  /*
  const result: any = {
    id: 76980364,
    custom_id: null,
    meta_data: {
      latitude: null,
      longitude: null,
      date: null,
      datetime: null,
    },

    uploaded_datetime: 1682289801.153236,
    finished_datetime: 1682289801.535504,
    images: [
      {
        file_name: '30b45130291b4c07935907d8b55ef67c.jpg',
        url: 'https://plant.id/media/images/30b45130291b4c07935907d8b55ef67c.jpg',
        url_small: 'https://plant.id/media/images/30b45130291b4c07935907d8b55ef67c_small.jpg',
        url_tiny: 'https://plant.id/media/images/30b45130291b4c07935907d8b55ef67c_tiny.jpg',
      },
    ],
    suggestions: [
      {
        id: 427883438,
        speciesId: 1414,
        plant_name: 'Cercis siliquastrum',
        plant_details: {
          language: 'en',
          scientific_name: 'Cercis siliquastrum',
          structured_name: {
            genus: 'cercis',
            species: 'siliquastrum',
          },
        },
        probability: 0.5709938606787563,
        confirmed: false,
        similar_images: [
          {
            id: '01f9bfcdd5c0630d219b3d2206fde99d',
            similarity: 0.3371811490564106,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/01f/9bfcdd5c0630d219b3d2206fde99d.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/01f/9bfcdd5c0630d219b3d2206fde99d.small.jpg',
            citation: 'nauruan',
            license_name: 'CC BY-SA 4.0',
            license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
          },
          {
            id: 'e0dddd164b44ecf1046c48b89d3cc35b',
            similarity: 0.31661188873280605,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/e0d/ddd164b44ecf1046c48b89d3cc35b.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/e0d/ddd164b44ecf1046c48b89d3cc35b.small.jpg',
          },
        ],
      },
      {
        id: 427883439,
        speciesId: 2829,
        plant_name: 'Cercis canadensis',
        plant_details: {
          language: 'en',
          scientific_name: 'Cercis canadensis',
          structured_name: {
            genus: 'cercis',
            species: 'canadensis',
          },
        },
        probability: 0.28628270732839955,
        confirmed: false,
        similar_images: [
          {
            id: 'c71c17656186314bc90eec851c544f4b',
            similarity: 0.35717193966271404,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/c71/c17656186314bc90eec851c544f4b.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/c71/c17656186314bc90eec851c544f4b.small.jpg',
          },
          {
            id: '1d088f8453c9c7849601481fee0c93fa',
            similarity: 0.33295690500624064,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/1d0/88f8453c9c7849601481fee0c93fa.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/1d0/88f8453c9c7849601481fee0c93fa.small.jpg',
          },
        ],
      },
      {
        id: 427883440,
        speciesId: 6009,
        plant_name: 'Cercis occidentalis',
        plant_details: {
          language: 'en',
          scientific_name: 'Cercis occidentalis',
          structured_name: {
            genus: 'cercis',
            species: 'occidentalis',
          },
        },
        probability: 0.07609543945997996,
        confirmed: false,
        similar_images: [
          {
            id: 'e6a26d1a589469b856ed6eb052a2aeed',
            similarity: 0.28644533938023603,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/e6a/26d1a589469b856ed6eb052a2aeed.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/e6a/26d1a589469b856ed6eb052a2aeed.small.jpg',
          },
          {
            id: 'eb5f45c207411a57739b473a1cd4ae87',
            similarity: 0.2543759609449969,
            url: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/eb5/f45c207411a57739b473a1cd4ae87.jpg',
            url_small: 'https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/images/eb5/f45c207411a57739b473a1cd4ae87.small.jpg',
          },
        ],
      },
    ],
    modifiers: ['similar_images'],
    secret: 'JB3AF8S9smiJrpV',
    fail_cause: null,
    countable: true,
    feedback: null,
    is_plant_probability: 0.9964666367999999,
    is_plant: true,
  };
  
  */
  console.log('result', result);

  if (result?.suggestions) {
    const suggestions: PartialSpeciesSuggestion[] = result?.suggestions.map((suggestion: any) => {
      console.log('suggestion', JSON.stringify(suggestion));
      return {
        id: suggestion.id,
        name: capitalizeFirst(suggestion.plant_name),
        commonName: capitalizeFirst(
          suggestion.plant_details?.common_names?.length > 0 ? suggestion.plant_details?.common_names[0] : suggestion.plant_name,
        ),
        genus: capitalizeFirst(suggestion.plant_details.structured_name.genus),
        species: suggestion.plant_details.structured_name.species,
        speciesId: suggestion.speciesId,
        probability: suggestion.probability,
        similarImages: suggestion.similar_images.map((image: any) => image.url_small),
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

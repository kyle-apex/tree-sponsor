import { PartialSpeciesSuggestion } from 'interfaces';

export const identifySuggestions = async (imageContent: string): Promise<PartialSpeciesSuggestion[]> => {
  const result: any = {
    id: 76980364,
    custom_id: null,
    meta_data: {
      latitude: null,
      longitude: null,
      date: null,
      datetime: null,
    },
    speciesId: 1414,
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

  if (result?.suggestions) {
    return result?.suggestions.map((suggestion: any) => {
      return {
        id: suggestion.id,
        name: suggestion.plant_name,
        genus: suggestion.plant_details.structured_name.genus,
        species: suggestion.plant_details.structured_name.species,
        speciesId: suggestion.speciesId,
        probability: suggestion.probability,
        similarImages: suggestion.similar_images.map((image: any) => image.url_small),
      };
    });
  }

  return [];
};

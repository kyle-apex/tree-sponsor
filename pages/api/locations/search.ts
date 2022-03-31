//
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Location } from '@prisma/client';

function getNeighborhood(feature: any) {
  const neighborhood = feature.context.find((ctx: any) => {
    return ctx.id.includes('neighborhood');
  });
  return neighborhood;
}

function getContextByPlaceType(feature: any, placeType: string) {
  const context = feature.context.find((ctx: any) => {
    return ctx.id.includes(placeType);
  });
  return context;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchText = req.query.search_text; // || '-97.768764'; //'-97.769054';-97.768764, 30.264246
  //const lat = req.query.lat || '30.264246'; // || '30.2453';

  console.log('req.pbody', req.body);
  console.log('req.url', req.url);
  console.log('req/query', req.query);
  //console.log('long', long, 'lat', lat);
  if (req.method === 'GET') {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?limit=10&country=US&types=poi&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

    if (!searchText.includes(',')) url += '&proximity=-97.768764,30.264246';

    console.log('url', url);

    const results = await axios.get(url);
    console.log('results', results);
    const features = results?.data?.features;
    let locations: Partial<Location>[] = [];

    if (features) {
      locations = features.map((feature: any) => {
        console.log('feature', feature);
        const neighborhood = getContextByPlaceType(feature, 'neighborhood');
        const place = getContextByPlaceType(feature, 'place');
        return {
          name: feature.text,
          address: feature.properties.address,
          placeName: feature.place_name,
          latitude: feature.center[0],
          longitude: feature.center[1],
          mapboxId: feature.id,
          mapboxNeighborhoodId: neighborhood?.id,
          mapboxPlaceId: place?.id,
          mapboxCategories: feature.properties.category,
          mapboxPlaceType: feature.place_type[0],
          foursquareId: feature.properties.foursquare,
        };
      });
      const neighborhood = getContextByPlaceType(features[0], 'neighborhood');
      console.log('neightborhood', neighborhood);
      const place = getContextByPlaceType(features[0], 'place');
      locations.splice(1, 0, { name: neighborhood.text, mapboxId: neighborhood.id, mapboxPlaceType: 'neighborhood', address: place.text });
    }

    res.status(200).json(locations);
  }
}

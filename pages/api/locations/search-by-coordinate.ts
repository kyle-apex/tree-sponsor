//
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { LocationTag } from '@prisma/client';

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
  const long = req.query.long || '-97.768764'; //'-97.769054';-97.768764, 30.264246
  const lat = req.query.lat || '30.264246'; // || '30.2453';
  console.log('req.pbody', req.body);
  console.log('req.url', req.url);
  console.log('req/query', req.query);
  console.log('long', long, 'lat', lat);
  if (req.method === 'GET') {
    const results = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?limit=5&types=poi&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    const features = results?.data?.features;
    let locations: Partial<LocationTag>[] = [];

    if (features) {
      locations = features.map((feature: any) => {
        const neighborhood = getContextByPlaceType(features[0], 'neighborhood');
        const place = getContextByPlaceType(features[0], 'place');
        return {
          name: feature.text,
          latitude: feature.center[0],
          longitude: feature.center[1],
          mapboxId: feature.id,
          mapboxNeighborhoodId: neighborhood.id,
          mapboxPlaceId: place.id,
          mapboxCategories: feature.properties.category,
          mapboxPlaceType: feature.place_type[0],
          foursquareId: feature.properties.foursquare,
        };
      });
      const neighborhood = getContextByPlaceType(features[0], 'neighborhood');
      const place = getContextByPlaceType(features[0], 'place');
      locations.splice(1, 0, { name: neighborhood.text, mapboxId: neighborhood.id, mapboxPlaceType: 'neighborhood' });
    }

    res.status(200).json(locations);
  }
}

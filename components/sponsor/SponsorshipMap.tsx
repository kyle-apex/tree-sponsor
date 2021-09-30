//import { Decimal } from 'decimal.js';
import * as React from 'react';
import { useState } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import { useGet } from 'utils/hooks/use-get';

// documentation: https://visgl.github.io/react-map-gl/docs/api-reference/marker

const SponsorshipMap = () => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 30.2594625,
    longitude: -97.7505386,
    zoom: 11,
  });

  const { data: sponsorships, isFetched, isFetching } = useGet<any[]>('/api/sponsorships/locations', 'sponsorship-locations');

  function showMarkerDetails(id: number) {
    console.log('id', id);
  }

  return (
    <MapGL
      {...viewport}
      onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      {sponsorships?.map(sponsorship => (
        <Marker
          key={sponsorship.id}
          latitude={Number(sponsorship.tree.latitude)}
          longitude={Number(sponsorship.tree.longitude)}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <img src='/logo.png' style={{ width: '30px', height: '30px' }} onClick={() => showMarkerDetails(sponsorship.id)} />
        </Marker>
      ))}

      <Marker latitude={30.28} longitude={-97.69} offsetLeft={-20} offsetTop={-10}>
        <img src='/logo.png' style={{ width: '30px', height: '30px' }} />
      </Marker>
    </MapGL>
  );
};

export default SponsorshipMap;

//import { Decimal } from 'decimal.js';
import * as React from 'react';
import { useState } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import { useGet } from 'utils/hooks/use-get';
import SponsorshipDisplayDialog from './SponsorshipDisplayDialog';

// documentation: https://visgl.github.io/react-map-gl/docs/api-reference/marker

const SponsorshipMap = () => {
  const [activeSponsorshipId, setActiveSponsorshipId] = useState<number>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 30.2594625,
    longitude: -97.7505386,
    zoom: 10.7,
  });

  const { data: sponsorships, isFetched, isFetching } = useGet<any[]>('/api/sponsorships/locations', 'sponsorship-locations');

  function showMarkerDetails(id: number) {
    console.log('id', id);
    setActiveSponsorshipId(id);
    setIsDialogOpen(true);
  }

  return (
    <>
      <MapGL
        {...viewport}
        onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        className='index-map mapboxgl-map box-shadow'
      >
        {sponsorships?.map(sponsorship => (
          <Marker
            key={sponsorship.id}
            latitude={Number(sponsorship.tree.latitude)}
            longitude={Number(sponsorship.tree.longitude)}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <img
              src='/pin-ring.svg'
              style={{ width: (50 * viewport.zoom) / 10 + 'px', cursor: 'pointer' }}
              onClick={() => showMarkerDetails(sponsorship.id)}
            />
          </Marker>
        ))}

        <Marker latitude={30.28} longitude={-97.69} offsetLeft={-20} offsetTop={-10}>
          <img src='/pin-ring.svg' style={{ width: (50 * viewport.zoom) / 10 + 'px', cursor: 'pointer' }} />
        </Marker>
      </MapGL>
      <SponsorshipDisplayDialog open={isDialogOpen} setOpen={setIsDialogOpen} id={activeSponsorshipId}></SponsorshipDisplayDialog>
    </>
  );
};

export default SponsorshipMap;

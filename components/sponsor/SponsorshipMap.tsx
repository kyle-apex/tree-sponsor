import React, { useState, useCallback, useRef } from 'react';
import MapGL, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl';
import { useGet } from 'utils/hooks/use-get';
import SponsorshipDisplayDialog from './SponsorshipDisplayDialog';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Geocoder from 'react-map-gl-geocoder';
import { Button, ButtonGroup } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import { PartialSponsorship, Viewport } from 'interfaces';

const geolocateControlStyle = {
  right: 10,
  top: 80,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const SEARCH_LOCATION = { longitude: -97.7405213210974, latitude: 30.27427678853506 };

const SponsorshipMap = ({ isExploreMode }: { isExploreMode?: boolean }) => {
  const [activeSponsorshipId, setActiveSponsorshipId] = useState<number>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [style, setStyle] = useState('mapbox://styles/mapbox/satellite-streets-v11');
  const mapRef = useRef();

  const [viewport, setViewport] = useState<Viewport>({
    width: '100%',
    height: '100%',
    latitude: 30.2594625,
    longitude: -97.7505386,
    zoom: 10.7,
  });

  const handleViewportChange = useCallback((newViewport: Viewport) => setViewport(newViewport), []);

  const { data: sponsorships } = useGet<PartialSponsorship[]>('/api/sponsorships/locations', 'sponsorship-locations');

  function showMarkerDetails(id: number) {
    setActiveSponsorshipId(id);
    setIsDialogOpen(true);
  }

  return (
    <>
      <MapGL
        {...viewport}
        ref={mapRef}
        onViewportChange={(nextViewport: Viewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        className='index-map mapboxgl-map box-shadow'
        mapStyle={isExploreMode ? style : 'mapbox://styles/mapbox/light-v10'}
      >
        {sponsorships?.map(sponsorship => {
          if (sponsorship?.tree?.latitude) {
            return (
              <Marker
                key={sponsorship.id}
                className='marker'
                latitude={Number(sponsorship.tree.latitude)}
                longitude={Number(sponsorship.tree.longitude)}
              >
                <img
                  src={isExploreMode ? 'pin-right-bright.svg' : '/pin-ring.svg'}
                  style={{
                    width: (50 * viewport.zoom) / 10 + 'px',
                    marginLeft: (-50 * viewport.zoom) / 20 + 'px',
                    marginTop: -1 * ((50 * viewport.zoom) / 10) * 1.3,
                    cursor: 'pointer',
                  }}
                  onClick={() => showMarkerDetails(sponsorship.id)}
                />
              </Marker>
            );
          }
        })}
        {isExploreMode && (
          <>
            <GeolocateControl
              auto={true}
              style={geolocateControlStyle}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
              fitBoundsOptions={{ maxZoom: 21 }}
            />
            <Geocoder
              mapRef={mapRef}
              mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              position='top-left'
              onViewportChange={handleViewportChange}
              proximity={SEARCH_LOCATION}
            />
            <NavigationControl style={navControlStyle} showCompass={false} />
            <div className='' style={{ position: 'absolute', right: '10px', bottom: '25px' }}>
              <ButtonGroup variant='outlined' aria-label='outlined button group' sx={{ backgroundColor: 'white' }}>
                <Button
                  color='inherit'
                  onClick={() => {
                    setStyle('mapbox://styles/mapbox/satellite-streets-v11');
                  }}
                >
                  <NaturePeopleIcon />
                </Button>
                <Button
                  color='inherit'
                  onClick={() => {
                    setStyle('mapbox://styles/mapbox/streets-v11');
                  }}
                >
                  <DirectionsCarIcon />
                </Button>
              </ButtonGroup>
            </div>
          </>
        )}
      </MapGL>
      <SponsorshipDisplayDialog open={isDialogOpen} setOpen={setIsDialogOpen} id={activeSponsorshipId}></SponsorshipDisplayDialog>
    </>
  );
};

export default SponsorshipMap;

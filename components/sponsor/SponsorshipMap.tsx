import React, { useState, useCallback, useRef } from 'react';
import MapGL, { GeolocateControl, NavigationControl } from 'react-map-gl';
import { useGet } from 'utils/hooks/use-get';
import SponsorshipDisplayDialog from './SponsorshipDisplayDialog';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Geocoder from 'react-map-gl-geocoder';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import { PartialSponsorship, Viewport } from 'interfaces';
import MapMarker from './MapMarker';

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
  const [isSatelliteMode, setIsSatelliteMode] = useState(isExploreMode);
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

  function updateSatelliteMode(isSatelliteMode: boolean) {
    if (isSatelliteMode) {
      setStyle('mapbox://styles/mapbox/satellite-streets-v11');
      setIsSatelliteMode(true);
    } else {
      setStyle('mapbox://styles/mapbox/streets-v11');
      setIsSatelliteMode(false);
    }
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
              <MapMarker
                key={sponsorship.id}
                latitude={Number(sponsorship.tree.latitude)}
                longitude={Number(sponsorship.tree.longitude)}
                isSatelliteMode={isExploreMode && isSatelliteMode}
                zoom={viewport.zoom}
                onClick={() => {
                  showMarkerDetails(sponsorship.id);
                }}
              ></MapMarker>
            );
          }
        })}
        {isExploreMode && (
          <>
            <GeolocateControl
              auto={false}
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
                    updateSatelliteMode(true);
                  }}
                >
                  <NaturePeopleIcon />
                </Button>
                <Button
                  color='inherit'
                  onClick={() => {
                    updateSatelliteMode(false);
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

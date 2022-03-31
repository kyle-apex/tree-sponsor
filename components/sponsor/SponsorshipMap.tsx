import React, { useState, useCallback, useRef, useEffect } from 'react';
import MapGL, { GeolocateControl, NavigationControl, WebMercatorViewport } from 'react-map-gl';
import { useGet } from 'utils/hooks/use-get';
import SponsorshipDisplayDialog from './SponsorshipDisplayDialog';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Geocoder from 'react-map-gl-geocoder';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import { Coordinate, PartialSponsorship, Viewport } from 'interfaces';
import MapMarker from './MapMarker';
import useTheme from '@mui/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MAP_STYLE } from 'consts';
import centerViewport from 'utils/maps/center-viewport';

const geolocateControlStyle = {
  right: 10,
  top: 80,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const SEARCH_LOCATION = { longitude: -97.7405213210974, latitude: 30.27427678853506 };

const SponsorshipMap = ({
  isExploreMode,
  defaultSponsorships,
  isIndexPage,
}: {
  isExploreMode?: boolean;
  defaultSponsorships?: PartialSponsorship[];
  isIndexPage?: boolean;
}) => {
  const [activeSponsorshipId, setActiveSponsorshipId] = useState<number>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSatelliteMode, setIsSatelliteMode] = useState(false);
  const [style, setStyle] = useState(MAP_STYLE.STREET);
  const mapRef = useRef();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const [viewport, setViewport] = useState<Viewport>({
    width: '100%',
    height: '100%',
    latitude: 30.2594625,
    longitude: -97.7505386,
    zoom: 10.7,
  });

  const handleViewportChange = useCallback((newViewport: Viewport) => setViewport(newViewport), []);

  let sponsorships: PartialSponsorship[];

  if (defaultSponsorships) {
    sponsorships = defaultSponsorships;
  } else {
    const { data: readSponsorships } = useGet<PartialSponsorship[]>('/api/sponsorships/locations', 'sponsorship-locations');
    sponsorships = readSponsorships;
  }

  useEffect(() => {
    if (defaultSponsorships) {
      const centeredViewport = centerViewport(
        viewport,
        sponsorships.map(sponsorship => {
          return { latitude: Number(sponsorship.tree?.latitude), longitude: Number(sponsorship.tree?.longitude) };
        }),
      );
      setViewport(centeredViewport);
    }
  }, []);

  function showMarkerDetails(id: number) {
    setActiveSponsorshipId(id);
    setIsDialogOpen(true);
  }

  function updateSatelliteMode(isSatelliteMode: boolean) {
    if (isSatelliteMode) {
      setStyle(MAP_STYLE.SATELLITE);
      setIsSatelliteMode(true);
    } else {
      setStyle(MAP_STYLE.STREET);
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
        mapStyle={isExploreMode ? style : MAP_STYLE.SIMPLE}
        dragPan={!(isIndexPage && isMobile)}
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
      {activeSponsorshipId && (
        <SponsorshipDisplayDialog open={isDialogOpen} setOpen={setIsDialogOpen} id={activeSponsorshipId}></SponsorshipDisplayDialog>
      )}
    </>
  );
};

export default React.memo(SponsorshipMap);

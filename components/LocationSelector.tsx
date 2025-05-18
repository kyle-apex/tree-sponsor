import React, { useCallback, useEffect, useRef } from 'react';
import MapGL, { Marker, GeolocateControl, NavigationControl, MapRef } from 'react-map-gl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Geocoder from 'react-map-gl-geocoder';
import RoomSharpIcon from '@mui/icons-material/RoomSharp';
import makeStyles from '@mui/styles/makeStyles';
import { MAP_STYLE } from 'consts';
import { MapStyle } from 'interfaces';
//import MapSearchBox from './MapSearchBox';
import dynamic from 'next/dynamic';
const MapSearchBox = dynamic(() => import('./MapSearchBox'), {
  ssr: false,
});

const geolocateControlStyle = {
  right: 10,
  top: 80,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const useStyles = makeStyles(() => ({
  marker: { color: '#EA4335' },
  markerContainer: { marginTop: '-50px', marginLeft: '-25px' },
  container: {
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
  },
}));

const SEARCH_LOCATION = { longitude: -97.7405213210974, latitude: 30.27427678853506 };
const LONGLAT = [-97.7405213210974, 30.27427678853506];
const LocationSelector = ({
  onViewportChange,
  latitude,
  longitude,
  zoomToLocation,
  mapStyle = 'STREET',
  zoom = 16,
  onSelectedName,
}: {
  onViewportChange: (viewport: { longitude: number; latitude: number; zoom: number; address?: string }) => void;
  longitude?: number;
  latitude?: number;
  zoomToLocation?: boolean;
  mapStyle?: MapStyle;
  zoom?: number;
  onSelectedName?: (name: string) => void;
}) => {
  const mapRef = useRef<MapRef>();
  const geolocatedRef = useRef<boolean>();

  const START_LONGITUDE = longitude || -97.7405213210974;
  const START_LATITUDE = latitude || 30.27427678853506;

  const [viewport, setViewport] = React.useState({
    longitude: START_LONGITUDE,
    latitude: START_LATITUDE,
    zoom: zoom,
  });

  const handleViewportChange = useCallback(newViewport => {
    onViewportChange(newViewport);

    setViewport({ ...newViewport, address: undefined });
  }, []);

  useEffect(() => {
    const map = mapRef?.current?.getMap();

    map?.on('load', function () {
      map.addSource('arcgis', {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=' +
            process.env.NEXT_PUBLIC_ARCGIS_TOKEN,
        ],
        minzoom: 0,
        maxzoom: 19,
      });
      map.addLayer({
        id: 'arcgis-layer',
        source: 'arcgis',
        type: 'raster',
        minzoom: 0,
        maxzoom: 24,
      });
      map.moveLayer('arcgis-layer', 'satellite');
      map.removeLayer('satellite');
    });
  }, []);

  const classes = useStyles();
  return (
    <div className='box-shadow'>
      <MapSearchBox
        mapRef={mapRef}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onViewportChange={handleViewportChange}
        proximity={LONGLAT}
        countries='US'
        zoom={viewport.zoom}
        onSelectedName={onSelectedName}
      />

      <MapGL
        {...viewport}
        ref={mapRef}
        width='100%'
        height='50vh'
        onViewportChange={(e: { longitude: number; latitude: number; zoom: number }) => {
          setViewport(e);

          onViewportChange({ latitude: e.latitude, longitude: e.longitude, zoom: e.zoom });
        }}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle={MAP_STYLE[mapStyle]}
      >
        <GeolocateControl
          auto={true}
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={false}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onViewportChange={() => {}}
          onGeolocate={(e: any) => {
            if (zoomToLocation || geolocatedRef.current) {
              setViewport({ longitude: e.coords.longitude, latitude: e.coords.latitude, zoom });
            }
            geolocatedRef.current = true;
          }}
          fitBoundsOptions={{ maxZoom: 20, zoom }}
        />

        {false && (
          <Geocoder
            mapRef={mapRef}
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            position='top-left'
            onViewportChange={handleViewportChange}
            proximity={SEARCH_LOCATION}
            countries='us'
          />
        )}

        <Marker latitude={viewport.latitude} longitude={viewport.longitude} className={classes.markerContainer}>
          <RoomSharpIcon style={{ fontSize: 50 }} className={classes.marker}></RoomSharpIcon>
        </Marker>
        <NavigationControl style={navControlStyle} showCompass={false} />
      </MapGL>
    </div>
  );
};

export default LocationSelector;

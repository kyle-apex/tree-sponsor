import React, { useCallback, useRef } from 'react';
import MapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Geocoder from 'react-map-gl-geocoder';
import RoomSharpIcon from '@mui/icons-material/RoomSharp';
import makeStyles from '@mui/styles/makeStyles';

const geolocateControlStyle = {
  right: 10,
  top: 80,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const START_LOCATION = { longitude: -97.7405213210974, latitude: 30.27427678853506 };

const useStyles = makeStyles(() => ({
  marker: { color: '#EA4335' },
  markerContainer: { marginTop: '-50px', marginLeft: '-25px' },
  container: {
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
  },
}));

const LocationSelector = ({
  onViewportChange,
}: {
  onViewportChange: (viewport: { longitude: number; latitude: number; zoom: number }) => void;
}) => {
  const mapRef = useRef();
  const [viewport, setViewport] = React.useState({
    //longitude: -97.7405213210974,
    //latitude: 30.27427678853506,
    longitude: -97.85117098722235,
    latitude: 30.476811100617866,
    zoom: 16,
  });

  //30.476811100617866, -97.85117098722235

  const handleViewportChange = useCallback(newViewport => setViewport(newViewport), []);

  const handleGeocoderViewportChange = useCallback(
    (newViewport: any) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange],
  );

  const classes = useStyles();
  return (
    <div className='box-shadow'>
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
        mapStyle='mapbox://styles/mapbox/satellite-v9'
      >
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
          proximity={START_LOCATION}
        />
        <Marker latitude={viewport.latitude} longitude={viewport.longitude} className={classes.markerContainer}>
          <RoomSharpIcon style={{ fontSize: 50 }} className={classes.marker}></RoomSharpIcon>
        </Marker>
        <NavigationControl style={navControlStyle} showCompass={false} />
      </MapGL>
    </div>
  );
};

export default LocationSelector;

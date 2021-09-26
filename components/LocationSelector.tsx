import React from 'react';
import MapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
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

const useStyles = makeStyles(() => ({
  marker: { color: '#EA4335' },
  container: {
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
  },
}));

const LocationSelector = ({
  onViewportChange,
}: {
  onViewportChange: (viewport: { longitude: number; latitude: number; zoom: number }) => void;
}) => {
  const [viewport, setViewport] = React.useState({
    longitude: -97.7405213210974,
    latitude: 30.27427678853506,
    zoom: 16,
  });
  const classes = useStyles();
  return (
    <div className='box-shadow'>
      <MapGL
        {...viewport}
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
          fitBoundsOptions={{ maxZoom: 18 }}
        />
        <Marker latitude={viewport.latitude} longitude={viewport.longitude} offsetLeft={-25} offsetTop={-46}>
          <RoomSharpIcon style={{ fontSize: 50 }} className={classes.marker}></RoomSharpIcon>
        </Marker>
        <NavigationControl style={navControlStyle} showCompass={false} />
      </MapGL>
    </div>
  );
};

export default LocationSelector;

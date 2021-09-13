import React from 'react';
import MapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import RoomSharpIcon from '@material-ui/icons/RoomSharp';

const geolocateControlStyle = {
  right: 10,
  top: 80,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

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
  return (
    <div>
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
          <RoomSharpIcon style={{ fontSize: 50 }} color='primary'></RoomSharpIcon>
        </Marker>
        <NavigationControl style={navControlStyle} showCompass={false} />
      </MapGL>

      <div>
        {viewport.latitude} - {viewport.longitude}
      </div>
    </div>
  );
};

export default LocationSelector;

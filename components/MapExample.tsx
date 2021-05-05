import * as React from 'react';
import { useState } from 'react';
import MapGL, { Marker } from 'react-map-gl';

// documentation: https://visgl.github.io/react-map-gl/docs/api-reference/marker

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia3lsZWhvc2tpbnMiLCJhIjoiY2tpbmQyeHMwMTI3MzM0anoxb3pheDY5aSJ9.EHtlH6RbQdW479USoPW6qQ';

const MapExample = () => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  function showMarkerDetails(a: React.MouseEvent<HTMLElement>) {
    console.log('a', a);
  }

  return (
    <MapGL {...viewport} onViewportChange={(nextViewport: any) => setViewport(nextViewport)} mapboxApiAccessToken={MAPBOX_TOKEN}>
      <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
        <img src='/logo.png' style={{ width: '30px', height: '30px' }} onClick={showMarkerDetails} />
      </Marker>
    </MapGL>
  );
};

export default MapExample;

import { useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { MapboxSearchBox } from '@mapbox/search-js-web';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from '@mapbox/search-js-react';

const MapSearchBox = ({
  mapRef,
  mapboxApiAccessToken,
  onViewportChange,
  proximity,
  countries,
  zoom,
  onSelectedName,
}: {
  mapRef: React.RefObject<MapRef>;
  mapboxApiAccessToken: string;
  onViewportChange?: (viewport: { longitude: number; latitude: number; zoom?: number; address?: string }) => void;
  proximity?: any;
  countries?: string;
  zoom?: number;
  onSelectedName?: (name: string) => void;
}) => {
  return (
    <SearchBox
      accessToken={mapboxApiAccessToken}
      mapboxgl={mapboxgl}
      map={mapRef?.current?.getMap()}
      options={{
        language: 'en',
        country: countries || 'US',
        proximity: proximity,
      }}
      onRetrieve={res => {
        if (res.features?.length) {
          const coordinates = res.features[0].geometry?.coordinates;
          if (coordinates?.length) {
            onViewportChange({
              latitude: coordinates[1],
              longitude: coordinates[0],
              zoom: zoom || 14,
              address: res.features[0].properties?.full_address,
            });
          }
          if (res.features[0].properties?.name && onSelectedName) onSelectedName(res.features[0].properties?.name);
        }
      }}
      onChange={(val: any) => console.log('changed', val)}
    />
  );
};
export default MapSearchBox;

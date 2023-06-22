import MapGL, { GeolocateControl, NavigationControl, WebMercatorViewport } from 'react-map-gl';
import { QuizCoordinate, Coordinate, MapStyle, Viewport } from 'interfaces';
import MapMarker from 'components/sponsor/MapMarker';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import centerViewport from 'utils/maps/center-viewport';
import { MAP_STYLE } from 'consts';
import CornerEditIcon from 'components/tree/CornerEditIcon';
import { useDebouncedCallback } from 'use-debounce';

const geolocateControlStyle = {
  right: 8,
  bottom: 40,
};

const MapMarkerDisplay = ({
  markers,
  onClick,
  defaultZoom,
  height,
  mapStyle,
  markerScale = 1,
  isQuiz,
  isEdit,
  defaultLatitude,
  defaultLongitude,
  showLocation,
  onViewportChange,
}: {
  markers: QuizCoordinate[];
  onClick?: (coordinate?: Coordinate) => void;
  defaultZoom?: number;
  height?: string;
  mapStyle?: MapStyle;
  markerScale: number;
  isQuiz?: boolean;
  isEdit?: boolean;
  defaultLatitude?: number;
  defaultLongitude?: number;
  showLocation?: boolean;
  onViewportChange?: (viewport: Partial<Viewport>) => void;
}) => {
  const mapRef = useRef();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const [viewport, setViewport] = useState<Partial<Viewport>>({
    width: '100%',
    height: height || '100%',
    latitude: defaultLatitude || 30.2594625,
    longitude: defaultLongitude || -97.7505386,
    zoom: defaultZoom || 10.7,
  });
  useEffect(() => {
    if (!showLocation) {
      //console.log('showLocation center', showLocation);
      const centeredViewport = centerViewport(
        viewport as Viewport,
        markers,
        mapRef?.current?.getMap()?._containerWidth || 350,
        height ? Number(height.replace('px', '').replace('%', '')) : 200,
      );
      setViewport(centeredViewport);
    }
  }, [markers, showLocation]);

  const debouncedOnViewportChange = useDebouncedCallback((viewport: Partial<Viewport>) => {
    if (onViewportChange) onViewportChange(viewport);
  }, 200);

  return (
    <MapGL
      {...viewport}
      ref={mapRef}
      onViewportChange={(nextViewport: Viewport) => {
        setViewport(nextViewport);
        if (onViewportChange) debouncedOnViewportChange(viewport);
      }}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      className={isEdit ? 'mapboxgl-map box-shadow' : 'index-map mapboxgl-map box-shadow'}
      mapStyle={MAP_STYLE[mapStyle]}
      dragPan={!isMobile}
    >
      {showLocation && (
        <GeolocateControl
          auto={false}
          style={{ ...geolocateControlStyle }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={false}
          // eslint-disable-next-line @typescript-eslint/no-empty-function

          onGeolocate={(_e: any) => {
            //console.log('on geolocate', e);
            //if (zoomToLocation || geolocatedRef.current) {
            /*setViewport({
              longitude: e.coords.longitude,
              latitude: e.coords.latitude,
              zoom: defaultZoom,
              width: '100%',
              height: height || '100%',
            });*/
            //}
            //geolocatedRef.current = true;
          }}
          fitBoundsOptions={{ maxZoom: defaultZoom + 0.5, defaultZoom }}
        />
      )}
      {markers?.map(marker => {
        if (marker?.latitude) {
          return (
            <MapMarker
              key={marker.latitude + marker.longitude}
              latitude={marker.latitude}
              longitude={marker.longitude}
              zoom={viewport.zoom * markerScale}
              onClick={() => {
                if (onClick) onClick(marker);
              }}
              isSatelliteMode={mapStyle == 'SATELLITE'}
              isQuiz={isQuiz}
              isQuizCorrect={marker.isQuizCorrect}
            ></MapMarker>
          );
        }
      })}
      {isEdit && <CornerEditIcon onClick={onClick}></CornerEditIcon>}
    </MapGL>
  );
};

export default MapMarkerDisplay;

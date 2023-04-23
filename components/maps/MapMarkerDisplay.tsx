import MapGL, { GeolocateControl, NavigationControl, WebMercatorViewport } from 'react-map-gl';
import { QuizCoordinate, Coordinate, MapStyle, Viewport } from 'interfaces';
import MapMarker from 'components/sponsor/MapMarker';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import centerViewport from 'utils/maps/center-viewport';
import { MAP_STYLE } from 'consts';
import CornerEditIcon from 'components/tree/CornerEditIcon';

const MapMarkerDisplay = ({
  markers,
  onClick,
  defaultZoom,
  height,
  mapStyle,
  markerScale = 1,
  isQuiz,
  isEdit,
}: {
  markers: QuizCoordinate[];
  onClick?: (coordinate?: Coordinate) => void;
  defaultZoom?: number;
  height?: string;
  mapStyle?: MapStyle;
  markerScale: number;
  isQuiz?: boolean;
  isEdit?: boolean;
}) => {
  const mapRef = useRef();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const [viewport, setViewport] = useState<Viewport>({
    width: '100%',
    height: height || '100%',
    latitude: 30.2594625,
    longitude: -97.7505386,
    zoom: defaultZoom || 10.7,
  });
  useEffect(() => {
    const centeredViewport = centerViewport(viewport, markers, 350, 200);
    setViewport(centeredViewport);
  }, [markers]);

  return (
    <MapGL
      {...viewport}
      ref={mapRef}
      onViewportChange={(nextViewport: Viewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      className={isEdit ? 'mapboxgl-map box-shadow' : 'index-map mapboxgl-map box-shadow'}
      mapStyle={MAP_STYLE[mapStyle]}
      dragPan={!isMobile}
    >
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

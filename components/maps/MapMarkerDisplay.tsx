/* eslint-disable @typescript-eslint/ban-ts-comment */
import MapGL, { GeolocateControl, MapRef, NavigationControl, WebMercatorViewport } from 'react-map-gl';
import { QuizCoordinate, Coordinate, MapStyle, Viewport } from 'interfaces';
import MapMarker from 'components/sponsor/MapMarker';
import { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import centerViewport from 'utils/maps/center-viewport';
import { MAP_STYLE } from 'consts';
import CornerEditIcon from 'components/tree/CornerEditIcon';
import { useDebouncedCallback } from 'use-debounce';
import GoogleMapReact from 'google-map-react';
import Box from '@mui/material/Box';
import QuizContext from 'components/tree/QuizContext';

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
  isGoogle,
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
  isGoogle?: boolean;
}) => {
  const mapRef = useRef<MapRef>();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  const [zoom, setZoom] = useState(16);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  //const [isRefreshing, setIsRefreshing] = useState(false);

  const [viewport, setViewport] = useState<Partial<Viewport>>({
    width: '100%',
    height: height || '100%',
    latitude: defaultLatitude || 30.2594625,
    longitude: defaultLongitude || -97.7505386,
    zoom: defaultZoom || 10.7,
  });
  const quizContext = useContext(QuizContext);

  const centerMapViewport = useCallback(() => {
    const centeredViewport = centerViewport(
      viewport as Viewport,
      markers,
      mapRef?.current ? mapRef?.current?.getMap()?._containerWidth || 350 : 350,
      height ? Number(height.replace('px', '').replace('%', '')) : 300,
    );
    centeredViewport.latitude = centeredViewport.latitude + Math.random() * 0.0001;
    centeredViewport.longitude = centeredViewport.longitude + Math.random() * 0.0001;
    centeredViewport.zoom = centeredViewport.zoom + Math.random() * 0.0001;

    setViewport(centeredViewport);
  }, [height, viewport, markers]);

  useEffect(() => {
    //console.log('changed markers', markers?.length, showLocation, quizContext?.isRefreshing);
    if (!showLocation && markers?.length && !quizContext?.isRefreshing) {
      centerMapViewport();
    }
  }, [quizContext?.isRefreshing, markers?.length, showLocation]);

  useEffect(() => {
    if (!isGoogle) {
      const map = mapRef.current?.getMap();
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
        try {
          map.moveLayer('arcgis-layer', 'satellite');
          map.removeLayer('satellite');
        } catch (err) {
          return;
        }
      });
    }
  }, []);

  const debouncedOnViewportChange = useDebouncedCallback((viewport: Partial<Viewport>) => {
    if (onViewportChange) onViewportChange(viewport);
  }, 200);

  return (
    <>
      {isGoogle && (
        <Box sx={{ height: '300px' }}>
          {true && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY }}
              center={{ lat: viewport.latitude, lng: viewport.longitude }}
              zoom={viewport.zoom + 0.5}
              options={{ mapTypeId: 'hybrid', fullscreenControl: false }}
              onZoomAnimationEnd={a => {
                setZoom(a);
              }}
              onGoogleApiLoaded={centerMapViewport}
              onTilesLoaded={() => {
                if (isInitialLoad) {
                  setIsInitialLoad(false);
                  centerMapViewport();
                }
              }}
            >
              {markers?.map(marker => {
                if (marker?.latitude) {
                  const minWidth = 30;
                  return (
                    <img
                      key={marker.latitude + marker.longitude}
                      /*
                    // @ts-ignore */
                      lat={marker.latitude}
                      lng={marker.longitude}
                      src={
                        marker.isQuizCorrect === true
                          ? '/pin-quiz-correct.svg'
                          : marker.isQuizCorrect === false
                          ? '/pin-quiz-incorrect.svg'
                          : '/pin-quiz.svg'
                      }
                      style={{
                        width: Math.max((30 * zoom) / 12, minWidth) + 'px',
                        marginLeft: Math.min((-30 * zoom) / 24, minWidth / -2) + 'px',
                        marginTop: -1 * Math.max((30 * zoom) / 12, minWidth) * 1.3,
                        zIndex: marker.isQuizCorrect === true || marker.isQuizCorrect === false ? 0 : 1,
                        position: 'absolute',
                        cursor: 'pointer',
                      }}
                      onClick={() => onClick(marker)}
                      alt='Map Marker'
                    ></img>
                  );
                }
              })}
            </GoogleMapReact>
          )}
        </Box>
      )}
      {!isGoogle && (
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
          //transformRequest={transformRequest}
          maxZoom={21}
        >
          {showLocation && (
            <GeolocateControl
              auto={false}
              style={{ ...geolocateControlStyle }}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={false}
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
                  zoom={Math.max(viewport.zoom * markerScale, 6.5)}
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
      )}
    </>
  );
};

export default MapMarkerDisplay;

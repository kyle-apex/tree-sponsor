import MapGL, { GeolocateControl, MapRef, NavigationControl, WebMercatorViewport } from 'react-map-gl';
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

const transformRequest = (url, resourceType) => {
  console.log('a', url, 'b', resourceType);
  if (
    resourceType === 'Tile' &&
    url.indexOf('https://services.arcgisonline.com') > -1 &&
    (url.includes('tile/21') || url.includes('tile/22') || url.includes('tile/20'))
  ) {
    return false; /*{
      url: url.replace('tile/21', 'tile/19'),
    };*/
  }
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
  const mapRef = useRef<MapRef>();
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
      //console.log('viewport', viewport);
      const centeredViewport = centerViewport(
        viewport as Viewport,
        markers,
        mapRef?.current ? mapRef?.current?.getMap()?._containerWidth || 350 : 350,
        height ? Number(height.replace('px', '').replace('%', '')) : 200,
      );
      //const map = mapRef.current.getMap();
      //console.log('map', map);
      //https://stackoverflow.com/questions/37100144/consume-arcgis-map-service-into-mapbox-gl-api

      setViewport(centeredViewport);
    }
  }, [markers, showLocation]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    console.log('map', map);
    map?.on('load', function () {
      console.log('called on laod', map.getStyle().layers);

      /*map.addLayer({
        id: 'raster-demo',
        type: 'raster',
        minzoom: 18,
        maxzoom: 21,
        source: {
          type: 'raster',
          tiles: [
            'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0&bbox={bbox-epsg-3857}&bboxSR=EPSG:3857&imageSR=EPSG:3857&size=256,256&f=image&token=AAPK40aa74276b30480aa4810d68c9f7f7b6zwPjVYsvY3jW-lc8oHHFwuJICLRE4G-eHV4z3ISfQXUkauWH1_a0nOUTnZ-bI7gc',
          ],
          tileSize: 256,
        },
      });*/
      //map.removeLayer('background');
      map.addSource('arcgis', {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=AAPK40aa74276b30480aa4810d68c9f7f7b6zwPjVYsvY3jW-lc8oHHFwuJICLRE4G-eHV4z3ISfQXUkauWH1_a0nOUTnZ-bI7gc',
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
        /*type: 'raster',
        minzoom: 0,
        maxzoom: 18.5,
        source: {
          type: 'raster',
          tiles: [
            'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=AAPK40aa74276b30480aa4810d68c9f7f7b6zwPjVYsvY3jW-lc8oHHFwuJICLRE4G-eHV4z3ISfQXUkauWH1_a0nOUTnZ-bI7gc',
          ],
          tileSize: 256,
        },*/
      });
      const satellite1 = map.getLayer('satellite');
      // window['satellite1'] = satellite1;
      //console.log('satellite1', satellite1);
      map.moveLayer('arcgis-layer', 'satellite');
      //map.moveLayer('satellite', 'cache-demo');
      //map.moveLayer('raster-demo', 'cache-demo');
      //map.moveLayer('satellite', 'raster-demo');
      map.removeLayer('satellite');
      //map.addLayer({ id: 'satellite', minzoom: 0, maxzoom: 14, type: 'raster', source: 'mapbox://mapbox.satellite' });
      //map.addLayer({ id: 'satellite2', minzoom: 18, maxzoom: 26, type: 'raster', source: 'mapbox://mapbox.satellite' });

      //map.moveLayer('satellite', 'cache-demo');
      //map.moveLayer('satellite2', 'raster-demo');

      console.log('called on laod', map.getStyle().layers);
    });
  }, []);

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
      //transformRequest={transformRequest}
      maxZoom={22}
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

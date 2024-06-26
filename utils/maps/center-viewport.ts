import { WebMercatorViewport } from 'react-map-gl';
import { Coordinate, Viewport } from 'interfaces';

const centerViewport = (viewport: Viewport, coordinates: Coordinate[], width?: number, height?: number) => {
  let minLng, minLat, maxLng, maxLat;
  for (const coordinate of coordinates || []) {
    if (coordinate.latitude) {
      if (!minLat) minLat = coordinate.latitude;
      if (!maxLat) maxLat = coordinate.latitude;
      minLat = minLat < coordinate.latitude ? minLat : coordinate.latitude;
      maxLat = maxLat > coordinate.latitude ? maxLat : coordinate.latitude;
    }
    if (coordinate.longitude) {
      if (!minLng) minLng = coordinate.longitude;
      if (!maxLng) maxLng = coordinate.longitude;
      minLng = minLng < coordinate.longitude ? minLng : coordinate.longitude;
      maxLng = maxLng > coordinate.longitude ? maxLng : coordinate.longitude;
    }
  }

  if (minLng) {
    const vp = new WebMercatorViewport({ height: height || 400, width: width || 400 });
    const { longitude, latitude, zoom } = vp.fitBounds(
      [
        [Number(minLng), Number(minLat)],
        [Number(maxLng), Number(maxLat)],
      ],
      { padding: { top: 30, left: 60, right: 60, bottom: 60 } },
    );
    const newZoom = zoom > 19 ? 19 : zoom;
    return { ...viewport, longitude, latitude, zoom: newZoom };
  }
  return viewport;
};

export default centerViewport;

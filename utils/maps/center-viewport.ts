import { WebMercatorViewport } from 'react-map-gl';
import { Coordinate, Viewport } from 'interfaces';

const centerViewport = (viewport: Viewport, coordinates: Coordinate[]) => {
  let minLng, minLat, maxLng, maxLat;
  for (const coordinate of coordinates) {
    if (coordinate.latitude) {
      if (!minLat) minLat = coordinate.latitude;
      if (!maxLat) maxLat = coordinate.latitude;
      minLat = minLat < coordinate.latitude ? minLat : coordinate.latitude;
      maxLat = maxLat > coordinate.latitude ? maxLat : coordinate.latitude;
    }
    if (coordinate.longitude) {
      if (!minLng) minLng = coordinate.longitude;
      if (!maxLng) maxLng = coordinate.longitude;
      minLng = minLng < coordinate.latitude ? minLng : coordinate.longitude;
      maxLng = maxLat > coordinate.latitude ? maxLng : coordinate.longitude;
    }
  }
  if (minLng) {
    const vp = new WebMercatorViewport({ height: 400, width: 400 });
    const { longitude, latitude, zoom } = vp.fitBounds(
      [
        [Number(minLng), Number(minLat)],
        [Number(maxLng), Number(maxLat)],
      ],
      {
        padding: 80,
      },
    );
    const newZoom = zoom > 16 ? 16 : zoom;
    return { ...viewport, longitude, latitude, zoom: newZoom };
  }
  return viewport;
};

export default centerViewport;

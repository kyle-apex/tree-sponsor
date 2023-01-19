import React from 'react';
import { Marker } from 'react-map-gl';

const MapMarker = ({
  isSatelliteMode,
  zoom,
  onClick,
  latitude,
  longitude,
  isQuiz,
}: {
  isSatelliteMode?: boolean;
  zoom: number;
  onClick: () => void;
  latitude: number;
  longitude: number;
  isQuiz?: boolean;
}) => {
  return (
    <Marker className='marker' latitude={latitude} longitude={longitude}>
      <img
        src={isQuiz ? '/pin-quiz.svg' : isSatelliteMode ? '/pin-right-bright.svg' : '/pin-ring.svg'}
        style={{
          width: (50 * zoom) / 10 + 'px',
          marginLeft: (-50 * zoom) / 20 + 'px',
          marginTop: -1 * ((50 * zoom) / 10) * 1.3,
          cursor: 'pointer',
        }}
        onClick={() => onClick()}
        alt='Map Marker'
      />
    </Marker>
  );
};
export default MapMarker;

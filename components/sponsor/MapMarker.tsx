import React from 'react';
import { Marker } from 'react-map-gl';

const MapMarker = ({
  isSatelliteMode,
  zoom,
  onClick,
  latitude,
  longitude,
  isQuiz,
  isQuizCorrect,
}: {
  isSatelliteMode?: boolean;
  zoom: number;
  onClick: () => void;
  latitude: number;
  longitude: number;
  isQuiz?: boolean;
  isQuizCorrect?: boolean;
}) => {
  return (
    <Marker
      className='marker'
      latitude={latitude}
      longitude={longitude}
      style={{ zIndex: isQuizCorrect === true || isQuizCorrect === false ? 0 : 1 }}
    >
      <img
        src={
          isQuiz
            ? isQuizCorrect === true
              ? '/pin-quiz-correct.svg'
              : isQuizCorrect === false
              ? '/pin-quiz-incorrect.svg'
              : '/pin-quiz.svg'
            : isSatelliteMode
            ? '/pin-right-bright.svg'
            : '/pin-ring.svg'
        }
        style={{
          width: (50 * zoom) / 10 + 'px',
          marginLeft: (-50 * zoom) / 20 + 'px',
          marginTop: -1 * ((50 * zoom) / 10) * 1.3,
          cursor: 'pointer',
        }}
        onClick={e => {
          onClick();
          e.stopPropagation();
          e.preventDefault();
        }}
        alt='Map Marker'
      />
    </Marker>
  );
};
export default MapMarker;

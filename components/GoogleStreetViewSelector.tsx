//30.24513
//https://maps.googleapis.com/maps/api/streetview?size=600x300&location=30.24513,-97.769236&key=KEY

import { useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

/*
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=KEY&amp;location=30.24513,-97.769236" allowfullscreen="">
</iframe>
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=KEY&amp;location=30.27123,-97.755503" allowfullscreen="">
</iframe>
30.27123,-97.755503
30.25375,-97.715442
30.4768,-97.851364
//https://developers.google.com/maps/documentation/javascript/examples/streetview-events
<script
      src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initPano&v=weekly"
      async
    ></script>
https://github.com/googlemaps/react-wrapper
*/
const GoogleStreetViewSelector = ({
  latitude,
  longitude,
  pitch,
  heading,
  handleChange,
}: {
  latitude?: number;
  longitude?: number;
  heading?: string;
  pitch?: string;
  handleChange: (propertyName: string, value: string | number) => void;
}) => {
  const ref = useRef();
  const pov = useRef<{ pitch?: string; heading?: string }>({});
  if (typeof window === 'undefined') return <></>;
  const google = window.google;

  useEffect(() => {
    const panorama = new google.maps.StreetViewPanorama(document.getElementById('streetView') as HTMLElement, {
      position: { lat: latitude, lng: longitude },
      pov: {
        pitch: Number(pitch),
        heading: Number(heading),
      },
      visible: true,
    });

    panorama.addListener('position_changed', () => {
      const position = panorama.getPosition() + '';

      //handleChange('postition', position);
      console.log('position', position);
    });

    panorama.addListener('pov_changed', () => {
      pov.current.heading = panorama.getPov().heading + '';
      pov.current.pitch = panorama.getPov().pitch + '';
      handleChange('heading', heading);
      handleChange('pitch', pitch);
      console.log('heading', pov.current.heading);
      console.log('pitch', pov.current.pitch);
    });
    return () => {
      google.maps.event.clearInstanceListeners(panorama);
    };
  });

  return <div ref={ref} id='streetView' style={{ height: '400px' }} />;
};
export default GoogleStreetViewSelector;

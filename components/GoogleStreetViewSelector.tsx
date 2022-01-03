//30.24513
//https://maps.googleapis.com/maps/api/streetview?size=600x300&location=30.24513,-97.769236&key=AIzaSyB5EkAThBBb4wCwk6vK_9mI233lNDtxUJ4

import { useEffect, useRef } from 'react';

/*
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB5EkAThBBb4wCwk6vK_9mI233lNDtxUJ4&amp;location=30.24513,-97.769236" allowfullscreen="">
</iframe>
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB5EkAThBBb4wCwk6vK_9mI233lNDtxUJ4&amp;location=30.27123,-97.755503" allowfullscreen="">
</iframe>
30.27123,-97.755503
30.25375,-97.715442
30.4768,-97.851364
//https://developers.google.com/maps/documentation/javascript/examples/streetview-events

https://github.com/googlemaps/react-wrapper
*/
const GoogleStreetViewSelector = ({
  latitude,
  longitude,
  pitch,
  heading,
}: {
  latitude: number;
  longitude: number;
  heading: string;
  pitch: string;
}) => {
  const ref = useRef();
  const pov = useRef<{ pitch?: string; heading?: string }>({});

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
      console.log('position', position);
    });

    panorama.addListener('pov_changed', () => {
      pov.current.heading = panorama.getPov().heading + '';
      pov.current.pitch = panorama.getPov().pitch + '';
      console.log('heading', pov.current.heading);
      console.log('pitch', pov.current.pitch);
    });
    return () => {
      google.maps.event.clearInstanceListeners(panorama);
    };
  });

  return <div ref={ref} id='streetView' />;
};
export default GoogleStreetViewSelector;

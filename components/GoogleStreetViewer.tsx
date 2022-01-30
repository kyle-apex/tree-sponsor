//30.24513
//https://maps.googleapis.com/maps/api/streetview?size=600x300&location=30.24513,-97.769236&key=KEY
/*
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=KEY&amp;location=30.24513,-97.769236" allowfullscreen="">
</iframe>
<iframe width="450" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?key=KEY&amp;location=30.27123,-97.755503" allowfullscreen="">
</iframe>
30.27123,-97.755503
30.25375,-97.715442
30.4768,-97.851364
//https://developers.google.com/maps/documentation/javascript/examples/streetview-events
*/
const GoogleStreetViewer = ({
  height = 400,
  width = 400,
  latitude,
  longitude,
}: {
  height?: number;
  width?: number;
  latitude: number;
  longitude: number;
}) => {
  const url = `https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY}&location=${latitude},${longitude}`;
  return <iframe width={width} height={height} frameBorder='0' style={{ border: 0 }} src={url}></iframe>;
};
export default GoogleStreetViewer;

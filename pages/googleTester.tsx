import GoogleStreetViewSelector from 'components/GoogleStreetViewSelector';
import GoogleStreetViewer from 'components/GoogleStreetViewer';

import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { Wrapper } from '@googlemaps/react-wrapper';
/*
<GoogleStreetViewer latitude={30.4768} longitude={-97.851364}></GoogleStreetViewer>

*/
const GoogleTester = () => (
  <Layout title='Tester'>
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY}>
      <GoogleStreetViewSelector
        latitude={30.4768}
        longitude={-97.851364}
        heading={'0'}
        pitch={'0'}
        handleChange={(a, b) => {
          console.log(a, b);
        }}
      />
    </Wrapper>
  </Layout>
);

export default GoogleTester;

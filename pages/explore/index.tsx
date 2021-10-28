import Layout from 'components/layout/Layout';
import SponsorshipMap from 'components/sponsor/SponsorshipMap';
import Container from '@mui/material/Container';
import React from 'react';

const Explore = () => {
  return (
    <Layout>
      <Container
        maxWidth='lg'
        sx={{ height: '90vh', maxHeight: 'calc(100vh - 150px)', width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <SponsorshipMap isExploreMode={true}></SponsorshipMap>
      </Container>
    </Layout>
  );
};

export default Explore;

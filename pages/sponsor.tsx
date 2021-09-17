import React from 'react';
import SponsorForm from 'components/sponsor/SponsorForm';
import Layout from 'components/layout/Layout';
import { Container } from '@material-ui/core';

const SponsorPage = () => {
  return (
    <Layout>
      <Container maxWidth='sm'>
        <h1>Sponsor a Tree</h1>
        <SponsorForm></SponsorForm>
      </Container>
    </Layout>
  );
};
export default SponsorPage;

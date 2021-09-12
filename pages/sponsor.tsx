import React from 'react';
import SponsorForm from 'components/sponsor/SponsorForm';
import Layout from 'components/layout/Layout';
import { Container } from '@material-ui/core';

const SponsorPage = () => {
  return (
    <Layout>
      <Container maxWidth='sm'>
        <SponsorForm></SponsorForm>
      </Container>
    </Layout>
  );
};
export default SponsorPage;

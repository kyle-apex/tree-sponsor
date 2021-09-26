import { Container, Grid, TextField } from '@material-ui/core';
import CheckoutButton from 'components/CheckoutButton';
import React from 'react';
import Layout from 'components/layout/Layout';
//import TreeDetail from 'components/sponsor/TreeDetails';

const SignupPage = () => {
  return (
    <Layout>
      <Container maxWidth='sm'>
        <Grid container direction='column'>
          <TextField label='Name'></TextField>
          <CheckoutButton price=''></CheckoutButton>CheckoutButton goes to stripe checkout...Under Construction
        </Grid>
      </Container>
    </Layout>
  );
};
export default SignupPage;

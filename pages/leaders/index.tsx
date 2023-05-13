import Layout from 'components/layout/Layout';
import SponsorshipMap from 'components/sponsor/SponsorshipMap';
import Container from '@mui/material/Container';
import React from 'react';
import Grid from '@mui/material/Grid';
import TopIdentifiers from 'components/leaders/TopIdentifiers';
import TopQuizResponders from 'components/leaders/TopQuizResponders';
import Typography from '@mui/material/Typography';

const LeadersPage = () => {
  return (
    <Layout title='Leaders'>
      <Container maxWidth='lg' sx={{ width: '100%', display: 'flex', flexDirection: 'column', pl: 0, pr: 0 }}>
        <Typography variant='h1'>Leaderboards</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {false && <Typography variant='h2'>Top Tree Identifiers</Typography>}

            <TopIdentifiers></TopIdentifiers>
          </Grid>
          <Grid item xs={12} md={6}>
            {false && <Typography variant='h2'>Tree ID Quiz Leaderboard</Typography>}
            <TopQuizResponders></TopQuizResponders>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default LeadersPage;

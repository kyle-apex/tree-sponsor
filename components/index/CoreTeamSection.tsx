import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CoreTeamBio from './CoreTeamBio';
import { PartialUser } from 'interfaces';
import { Divider, SectionHeader } from './StyledComponents';

interface CoreTeamSectionProps {
  users: PartialUser[];
}

const CoreTeamSection: React.FC<CoreTeamSectionProps> = ({ users }) => {
  return (
    <Container maxWidth='lg' sx={{ textAlign: 'center' }}>
      <Divider />
      <SectionHeader variant='h2' color='secondary' sx={{ mb: 5 }}>
        Meet Our Core Team
      </SectionHeader>

      <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={2} mb={6}>
        <Grid item xs={12} sm={6} md={4} mb={4}>
          <CoreTeamBio
            user={{
              name: 'You?',
              image: 'https://www.treefolks.org/wp-content/uploads/2022/07/questionmark.png',
              profile: {
                title: 'Click here to apply',
                bio: 'TreeFolks Young Professionals Core Team members volunteer to help plan social, educational, volunteer, and fundraising events to help engage young professionals in planting trees and caring for the environment.',
              },
            }}
          />
        </Grid>
        {users?.map((user: PartialUser) => (
          <Grid key={user.id} item xs={12} sm={6} md={4} mb={4}>
            <CoreTeamBio user={user} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoreTeamSection;

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Attendee from 'components/event/Attendee';
import { PartialUser } from 'interfaces';
import LeaderTable from './LeaderTable';

const TopIdentifiers = () => {
  const user: PartialUser = { name: 'Kyle', profile: { organization: 'American Airlines', instagramHandle: '@hoskinskyle' } };
  const user2: PartialUser = { name: 'Dr. Miller', profile: { organization: 'The Vets?', instagramHandle: '@hoskinskyle' } };

  return (
    <>
      <LeaderTable
        leaders={[
          { user: user2, position: 1, count: 11 },
          { user, position: 2, count: 7 },
        ]}
      ></LeaderTable>
      {false && (
        <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            1.
          </Typography>
          <Box sx={{ flex: '1 1 100%' }}>
            <Attendee hideContactPageIcon={true} user={user}></Attendee>
          </Box>
          <Typography variant='h5' sx={{ mb: 2, justifySelf: 'flex-end' }}>
            7
          </Typography>
        </Box>
      )}
    </>
  );
};
export default TopIdentifiers;

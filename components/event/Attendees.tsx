import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PartialUser } from 'interfaces';
import Attendee from './Attendee';

const Attendees = ({ users }: { users: PartialUser[] }) => {
  return (
    <Box mb={2} component='section'>
      <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
        Who&apos;s here:
      </Typography>
      {users?.map(user => {
        return <Attendee key={user.id} user={user} />;
      })}
    </Box>
  );
};
export default Attendees;

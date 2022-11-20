import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RestrictSection from 'components/RestrictSection';
import { PartialUser } from 'interfaces';
import { useState } from 'react';
import Attendee from './Attendee';
import EditIcon from '@mui/icons-material/Edit';

const Attendees = ({ users, onDelete }: { users: PartialUser[]; onDelete?: (userId: number) => void }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <Box mb={2} component='section'>
      <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
        Who&apos;s here:{' '}
        <RestrictSection accessType='isAdmin'>
          <IconButton
            aria-label='edit'
            size='medium'
            onClick={() => {
              setIsEditMode(!isEditMode);
            }}
          >
            <EditIcon />
          </IconButton>
        </RestrictSection>
      </Typography>
      {users?.map(user => {
        return <Attendee key={user.id} isEditMode={isEditMode} onDelete={() => onDelete(user.id)} user={user} />;
      })}
    </Box>
  );
};
export default Attendees;

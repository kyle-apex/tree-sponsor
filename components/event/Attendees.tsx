import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RestrictSection from 'components/RestrictSection';
import { PartialUser } from 'interfaces';
import { useState } from 'react';
import Attendee from './Attendee';
import EditIcon from '@mui/icons-material/Edit';
import useLocalStorage from 'utils/hooks/use-local-storage';

const Attendees = ({
  users,
  onDelete,
  onSetIsPrivate,
  isPrivate,
  onRefresh,
  isShowAll = false,
  limit = 10,
}: {
  users: PartialUser[];
  onDelete?: (userId: number) => void;
  onSetIsPrivate?: () => void;
  isPrivate?: boolean;
  onRefresh?: () => void;
  isShowAll?: boolean;
  limit?: number;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Box mb={2} component='section'>
      <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={3} mt={1}>
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
      {users?.map((user, idx) => {
        if (isShowAll || idx < limit)
          return (
            <Attendee
              key={user.id}
              isEditMode={isEditMode}
              onDelete={() => onDelete(user.id)}
              onSetIsPrivate={onSetIsPrivate}
              isPrivate={isPrivate}
              user={user}
              onRefresh={onRefresh}
              sx={{ mb: 2 }}
            />
          );
      })}
    </Box>
  );
};
export default Attendees;

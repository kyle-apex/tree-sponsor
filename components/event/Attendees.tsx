import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RestrictSection from 'components/RestrictSection';
import { PartialUser } from 'interfaces';
import { useCallback, useMemo, useState } from 'react';
import Attendee from './Attendee';
import EditIcon from '@mui/icons-material/Edit';
import useLocalStorage from 'utils/hooks/use-local-storage';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

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
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [infoDialogText, setInfoDialogText] = useState('');

  const onOpenInfoDialog = useCallback((message: string) => {
    setIsInfoDialogOpen(true);
    setInfoDialogText(message);
  }, []);

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
              onDelete={async () => onDelete(user.id)}
              onSetIsPrivate={onSetIsPrivate}
              isPrivate={isPrivate}
              user={user}
              onRefresh={onRefresh}
              onOpenInfoDialog={onOpenInfoDialog}
              sx={{ mb: 2 }}
            />
          );
      })}
      <Dialog open={isInfoDialogOpen} onClose={() => setIsInfoDialogOpen(false)}>
        <DialogContent className=''>
          <Typography sx={{ mt: 2 }}>{infoDialogText}</Typography>
          <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={() => setIsInfoDialogOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default Attendees;

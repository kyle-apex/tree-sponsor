import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import RestrictSection from 'components/RestrictSection';
import DeleteIconButton from 'components/DeleteIconButton';
import IconButton from '@mui/material/IconButton';
import ContactPage from '@mui/icons-material/ContactPage';
import AttendeeContactDialog from './AttendeeContactDialog';
import { useState } from 'react';

const userNameDisplay = ({ user }: { user: PartialUser }) => (
  <Typography
    variant='subtitle2'
    color={user.profilePath ? 'primary' : ''}
    className={user.profilePath ? 'clickable' : ''}
    sx={{ fontWeight: user.profilePath ? 600 : 500, textDecoration: user.profilePath ? 'underline' : '' }}
  >
    {user.displayName || user.name}
  </Typography>
);

const Attendee = ({ user, onDelete, isEditMode }: { user: PartialUser; onDelete: () => void; isEditMode?: boolean }) => {
  const isCoreTeam = !!user.roles?.find(role => role.name == 'Core Team');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  // TODO: Remove This
  user.profilePath = null;
  const hasContact = user.profile?.instagramHandle || user.profile?.twitterHandle || user.profile?.linkedInLink;
  return (
    <Box flexDirection='row' sx={{ display: 'flex' }} gap={2} mb={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <UserAvatar image={user.image} name={user.displayName || user.name} size={30} />
      </Box>
      <Box className='full-width'>
        <Box flexDirection='row' gap={1} sx={{ display: 'flex', marginBottom: 0.5, width: '100%', alignItems: 'center', height: '100%' }}>
          {user.profilePath && <Link href={'/u/' + user.profilePath}>{userNameDisplay({ user })}</Link>}
          {!user.profilePath && userNameDisplay({ user })}
          {isCoreTeam && (
            <Typography variant='subtitle2' color='gray'>
              Core Team
            </Typography>
          )}
          {!isCoreTeam && user.subscriptions?.length > 0 && (
            <Typography variant='subtitle2' color='gray'>
              Member
            </Typography>
          )}
          {isEditMode && (
            <RestrictSection accessType='isAdmin'>
              <DeleteIconButton onDelete={onDelete} tooltip='Remove Checkin'></DeleteIconButton>
            </RestrictSection>
          )}

          {hasContact && (
            <>
              <Box sx={{ flex: '1 1 auto' }}></Box>
              <IconButton
                onClick={() => {
                  setIsContactDialogOpen(true);
                }}
              >
                <ContactPage color='secondary'></ContactPage>
              </IconButton>
              <AttendeeContactDialog user={user} isOpen={isContactDialogOpen} setIsOpen={setIsContactDialogOpen}></AttendeeContactDialog>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Attendee;

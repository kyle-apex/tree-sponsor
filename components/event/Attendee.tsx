import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import RestrictSection from 'components/RestrictSection';
import DeleteIconButton from 'components/DeleteIconButton';
import IconButton from '@mui/material/IconButton';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
import AttendeeContactDialog from './AttendeeContactDialog';
import { useState } from 'react';
import useLocalStorage from 'utils/hooks/use-local-storage';
import AttendeeSettingsDialog from './AttendeeSettingsDialog';
import useHashToggle from 'utils/hooks/use-hash-toggle';

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

const Attendee = ({
  user,
  onDelete,
  isEditMode,
  onSetIsPrivate,
  isPrivate,
  onRefresh,
}: {
  user: PartialUser;
  onDelete: () => void;
  isEditMode?: boolean;
  onSetIsPrivate?: () => void;
  isPrivate?: boolean;
  onRefresh?: () => void;
}) => {
  const isCoreTeam = !!user.roles?.find(role => role.name == 'Core Team');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useHashToggle('settings', false);
  const [email] = useLocalStorage('checkinEmail', '');

  const onSettingsDialogClose = (val: boolean) => {
    setIsSettingsDialogOpen(val);
    onRefresh();
  };

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
          <Box sx={{ flex: '1 1 auto' }}></Box>
          {(email == user.email || email == `"${user.email}"`) && (
            <>
              {isPrivate && (
                <Tooltip title='Hidden from other attendees'>
                  <VisibilityOffIcon color='secondary'></VisibilityOffIcon>
                </Tooltip>
              )}
              <IconButton
                onClick={() => {
                  setIsSettingsDialogOpen(true);
                }}
                sx={{ ml: 1, padding: 0 }}
              >
                <SettingsIcon color='secondary'></SettingsIcon>
              </IconButton>
              <AttendeeSettingsDialog
                onSetIsPrivate={onSetIsPrivate}
                user={user}
                isOpen={isSettingsDialogOpen}
                setIsOpen={onSettingsDialogClose}
                isPrivate={isPrivate}
              ></AttendeeSettingsDialog>
            </>
          )}

          {hasContact && (
            <>
              <IconButton
                onClick={() => {
                  setIsContactDialogOpen(true);
                }}
                sx={{ ml: 1, padding: 0 }}
              >
                <ContactPageIcon color='secondary'></ContactPageIcon>
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

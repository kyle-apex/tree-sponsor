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
import { SxProps, Theme } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

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

const hasRole = (user: PartialUser, roleName: string): boolean => {
  if (roleName == 'Staff' && (user.email?.endsWith('@treefolks.org') || user.email2?.endsWith('@treefolks.org'))) return true;
  return !!user.roles?.find(role => role.name == roleName);
};

const getRoleDisplay = (user: PartialUser): string => {
  if (hasRole(user, 'Staff')) return 'Staff';
  else if (hasRole(user, 'Organizer')) return 'Organizer';
  else if (hasRole(user, 'Exec Team')) return 'Exec Team';
  else if (hasRole(user, 'Core Team')) return 'Core Team';
  else if (user.referredUsers?.length > 0) return 'Ambassador';
  else if (user.subscriptions?.length > 0) return 'Supporter';
};

const currentAttendeeStyles = {
  ml: -1,
  mr: -1,
  padding: 1,
  border: 'solid 1px var(--outline-color)',
  borderRadius: '5px',
  pl: 1,
  pr: 1,
  backgroundColor: '#f7f7f7',
};

const Attendee = ({
  user,
  onDelete,
  isEditMode,
  onSetIsPrivate,
  isPrivate,
  onRefresh,
  hideContactPageIcon,
  onOpenInfoDialog,
  sx,
}: {
  user: PartialUser;
  onDelete?: () => Promise<void>;
  isEditMode?: boolean;
  onSetIsPrivate?: () => void;
  isPrivate?: boolean;
  onRefresh?: () => void;
  hideContactPageIcon?: boolean;
  onOpenInfoDialog?: (message: string) => void;
  sx?: SxProps<Theme>;
}) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useHashToggle('settings', false);
  const [email] = useLocalStorage('checkinEmail', '', 'checkinEmail2');

  const onSettingsDialogClose = (val: boolean) => {
    setIsSettingsDialogOpen(val);
    if (onRefresh) onRefresh();
  };

  // TODO: Remove This
  user.profilePath = null;
  const hasContact = user.profile?.instagramHandle || user.profile?.twitterHandle || user.profile?.linkedInLink || user.profile?.bio;

  const roleDisplay = getRoleDisplay(user);
  const isCurrentUser =
    (email?.toLowerCase() == user.email?.toLowerCase() ||
      email?.toLowerCase() == `"${user.email?.toLowerCase()}"` ||
      email?.toLowerCase() == user.email2?.toLowerCase() ||
      email?.toLowerCase() == `"${user.email2?.toLowerCase()}"`) &&
    !hideContactPageIcon;

  const stylesSx = isCurrentUser ? { ...sx, ...currentAttendeeStyles } : { ...sx };

  return (
    <Box flexDirection='column' sx={stylesSx} className={isCurrentUser ? 'box-shadow' : ''}>
      <Box flexDirection='row' sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={() => {
            setIsContactDialogOpen(true);
          }}
        >
          <UserAvatar image={user.image} name={user.displayName || user.name} size={30} />
        </Box>
        <Box className='full-width'>
          <Box flexDirection='row' gap={1} sx={{ display: 'flex', marginBottom: 0.5, width: '100%', alignItems: 'center', height: '100%' }}>
            <Box>
              <Box flexDirection='row' gap={1} sx={{ display: 'flex', width: '100%', alignItems: 'center', height: '100%' }}>
                {!user.profilePath && userNameDisplay({ user })}
                {roleDisplay && (
                  <Typography variant='subtitle2' color='gray' sx={{ fontSize: '.8rem' }}>
                    {roleDisplay}
                  </Typography>
                )}
                {user.referredUsers?.length > 0 && (
                  <Typography
                    variant='subtitle2'
                    color='gray'
                    sx={{
                      /*backgroundColor: theme => theme.palette.primary.main,*/
                      background: 'linear-gradient(to top, #486e62, #486e62cc),url(/background-lighter.svg)',
                      color: 'white',
                      fontSize: '.8rem',
                      padding: '1px 6px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      if (onOpenInfoDialog)
                        onOpenInfoDialog(
                          `${user.name} has referred ${user.referredUsers?.length} supporting member${
                            user.referredUsers?.length > 1 ? 's' : ''
                          } to TreeFolksYP!`,
                        );
                    }}
                  >
                    <PersonAddAltIcon sx={{ fontSize: '1rem', mr: 0.6 }}></PersonAddAltIcon>
                    {user.referredUsers?.length}
                  </Typography>
                )}

                {isEditMode && (
                  <RestrictSection accessType='isAdmin'>
                    <DeleteIconButton
                      onDelete={onDelete}
                      tooltip='Remove Checkin'
                      title='Remove Checkin'
                      itemType='checkin'
                    ></DeleteIconButton>
                  </RestrictSection>
                )}
              </Box>
              {user.profile?.organization && (
                <Typography variant='subtitle2' color='gray' sx={{ fontStyle: 'italic', fontSize: '.7rem' }}>
                  {user.profile.organization}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: '1 1 auto' }}></Box>
            {isCurrentUser && (
              <>
                {isPrivate && (
                  <Tooltip title='Hidden from other attendees'>
                    <VisibilityOffIcon color='secondary'></VisibilityOffIcon>
                  </Tooltip>
                )}
                {(user.displayName || user.name) && (
                  <IconButton
                    onClick={() => {
                      setIsSettingsDialogOpen(true);
                    }}
                    sx={{ ml: 1, padding: 0 }}
                  >
                    <SettingsIcon color='secondary'></SettingsIcon>
                  </IconButton>
                )}
                <AttendeeSettingsDialog
                  onSetIsPrivate={onSetIsPrivate}
                  user={user}
                  isOpen={isSettingsDialogOpen}
                  setIsOpen={onSettingsDialogClose}
                  isPrivate={isPrivate}
                ></AttendeeSettingsDialog>
              </>
            )}

            {(hasContact || user.image) && (
              <>
                {hasContact && !hideContactPageIcon && (
                  <IconButton
                    onClick={() => {
                      setIsContactDialogOpen(true);
                    }}
                    sx={{ ml: 1, padding: 0 }}
                  >
                    <ContactPageIcon color='secondary'></ContactPageIcon>
                  </IconButton>
                )}
                <AttendeeContactDialog user={user} isOpen={isContactDialogOpen} setIsOpen={setIsContactDialogOpen}></AttendeeContactDialog>
              </>
            )}
          </Box>
        </Box>
      </Box>
      {isCurrentUser && !roleDisplay && (
        <Box mt={1.25} sx={{ lineHeight: 1.4, fontSize: '80%' }}>
          <Link href='/membership'>
            <Box>
              <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>Become a supporter</a> of planting trees with an annual $20
              donation to TreeFolks!
            </Box>
          </Link>
        </Box>
      )}
    </Box>
  );
};
export default Attendee;

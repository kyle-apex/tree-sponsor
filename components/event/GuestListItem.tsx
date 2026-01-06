import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SupporterIcon from '@mui/icons-material/VerifiedSharp';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import { UserAvatar } from 'components/sponsor';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import AttendeeSettingsDialog from './AttendeeSettingsDialog';
import useHashToggle from 'utils/hooks/use-hash-toggle';

interface GuestListItemProps {
  user: PartialUser;
  index: number;
  currentUser: PartialUser;
  currentUserSX?: object;
}

const currentUserStyles = {
  ml: -1,
  mb: 2,
  mr: -1,
  padding: 1,
  border: 'solid 1px var(--outline-color)',
  borderRadius: '5px',
  pl: 1,
  pr: 1,
  backgroundColor: '#f7f7f7',
};

const GuestListItem: React.FC<GuestListItemProps> = ({ user, index, currentUser, currentUserSX }) => {
  // Extract first name (up to the first space)
  const firstName = user.name ? user.name.split(' ')[0] : '';
  const supporterMessage = `${firstName} supports planting trees in Austin with an annual donation to TreeFolks!`;
  const isCurrentUser = currentUser && user.name === currentUser.name;
  const isCurrentUserMember = !!currentUser?.subscriptions?.length;
  currentUserSX = isCurrentUser && !isCurrentUserMember ? currentUserSX || currentUserStyles : {};

  // Settings dialog state
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useHashToggle('profile-settings', false);

  const onSettingsDialogClose = (val: boolean) => {
    setIsSettingsDialogOpen(val);
  };

  return (
    <Box key={user.id} sx={currentUserSX} className={isCurrentUser && !isCurrentUserMember ? 'box-shadow' : ''}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <UserAvatar image={user.image} name={user.displayName || user.name} size={30} colorIndex={index} />
        <Typography variant='subtitle2'>{user.displayName || user.name}</Typography>
        {user.subscriptions?.length > 0 && (
          <>
            {/* This tooltip shows on hover naturally */}
            <Tooltip title={supporterMessage} enterTouchDelay={0} leaveTouchDelay={4000} arrow>
              <SupporterIcon fontSize='small' sx={{ ml: -1.5, cursor: 'pointer' }} color='primary' />
            </Tooltip>
          </>
        )}
        {isCurrentUser && (
          <>
            <Box sx={{ flex: '1 1 auto' }}></Box>
            <IconButton
              onClick={() => {
                setIsSettingsDialogOpen(true);
              }}
              sx={{ padding: 0 }}
            >
              <SettingsIcon color='secondary'></SettingsIcon>
            </IconButton>
          </>
        )}
      </Box>
      {isCurrentUser && !isCurrentUserMember && (
        <Box mt={1} sx={{ lineHeight: 1.4, fontSize: '80%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupporterIcon fontSize='medium' sx={{ ml: 0 }} color='primary' />
          <Link href='/membership'>
            <Box>
              <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>Become a supporter</a> of planting trees with an annual $20
              donation to TreeFolks!
            </Box>
          </Link>
        </Box>
      )}

      {/* Add the AttendeeSettingsDialog with simplified mode */}
      {isCurrentUser && (
        <AttendeeSettingsDialog
          user={user}
          isOpen={isSettingsDialogOpen}
          setIsOpen={onSettingsDialogClose}
          isPrivate={false}
          simplifiedMode={true}
        />
      )}
    </Box>
  );
};

export default GuestListItem;

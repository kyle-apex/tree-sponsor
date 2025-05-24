import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SupporterIcon from '@mui/icons-material/VerifiedSharp';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import { UserAvatar } from 'components/sponsor';

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
  const [showClickTooltip, setShowClickTooltip] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true); // Default to true for SSR

  // Extract first name (up to the first space)
  const firstName = user.name ? user.name.split(' ')[0] : '';
  const supporterMessage = `${firstName} supports planting trees in Austin with an annual donation to TreeFolks!`;
  const isCurrentUser = currentUser && user.name === currentUser.name;
  const isCurrentUserMember = !!currentUser.subscriptions?.length;
  currentUserSX = isCurrentUser && !isCurrentUserMember ? currentUserSX || currentUserStyles : {};
  // Detect if device supports hover
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Check if the device supports hover
      const mediaQuery = window.matchMedia('(hover: hover)');
      setSupportsHover(mediaQuery.matches);
    }
  }, []);

  const handleSupporterIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Only show click tooltip on devices that don't support hover
    if (!supportsHover) {
      setShowClickTooltip(true);
      // Auto-hide tooltip after 4 seconds
      setTimeout(() => setShowClickTooltip(false), 4000);
    }
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
            <Tooltip title={supporterMessage} arrow>
              <SupporterIcon fontSize='small' sx={{ ml: -1.5, cursor: 'pointer' }} color='primary' onClick={handleSupporterIconClick} />
            </Tooltip>

            {/* This is for showing the message when clicked (only on mobile/touch devices) */}
            {!supportsHover && showClickTooltip && (
              <Box
                sx={{
                  position: 'absolute',
                  bgcolor: 'rgba(97, 97, 97, 0.9)',
                  color: '#fff',
                  borderRadius: 1,
                  p: 1,
                  fontSize: '0.75rem',
                  maxWidth: 220,
                  zIndex: 1500,
                  mt: 2,
                  ml: -10,
                  boxShadow: 1,
                }}
              >
                {supporterMessage}
              </Box>
            )}
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
    </Box>
  );
};

export default GuestListItem;

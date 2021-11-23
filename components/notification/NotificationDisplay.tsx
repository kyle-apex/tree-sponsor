import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import { PartialNotification } from 'interfaces';
import Link from 'next/link';
import React from 'react';

const formatDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  if (date.getFullYear() != new Date().getFullYear()) dateStr += ' ' + date.getFullYear();
  return dateStr;
};

const NotificationDisplay = ({ notification, onAction }: { notification: PartialNotification; onAction: (link: string) => void }) => {
  const user = notification.sourceUser;
  const userName = user ? user.displayName ?? user.name : 'Anonymous';
  return (
    <Box sx={{ flexDirection: 'row', display: 'flex' }} gap={1}>
      <Box
        pt={0.5}
        onClick={() => {
          onAction(user?.profilePath ? '/u/' + user.profilePath : '');
        }}
      >
        <UserAvatar image={user?.image} name={userName} size={30} />
      </Box>
      <Box onClick={() => onAction(notification.link)} sx={{ whiteSpace: 'normal' }}>
        <Typography>
          {notification.type === 'comment' && (
            <>
              <b>{userName}</b> commented on <b>{notification.parameter}</b>
            </>
          )}
          {notification.type === 'reaction' && (
            <>
              <b>{userName}</b> liked <b>{notification.parameter}</b>
            </>
          )}
        </Typography>
        <Box>
          <Typography variant='subtitle2' color='gray'>
            {formatDate(notification.createdDate)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default NotificationDisplay;

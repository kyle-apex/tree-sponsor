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

const NotificationDisplay = ({ notification }: { notification: PartialNotification }) => {
  const user = notification.user;
  const userName = user.displayName ?? user.name;
  return (
    <Box sx={{ flexDirection: 'row', display: 'flex' }} gap={1}>
      <Box pt={0.5}>
        <UserAvatar image={notification.user.image} name={notification.user.name} size={30} />
      </Box>
      <Box>
        <Typography>
          {notification.type === 'comment' && (
            <>
              {userName} commented on {notification.parameter}
            </>
          )}
          {notification.type === 'reaction' && (
            <>
              {userName} liked {notification.parameter}
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

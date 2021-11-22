import React, { useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import { PartialNotification } from 'interfaces';

const NotificationIcon = () => {
  const [session] = useSession();

  const { data: notifications, isFetched, refetch } = useGet<PartialNotification[]>('/api/me/notifications', 'my-notifications');

  useEffect(() => {
    refetch();
  }, [session]);
  return (
    <>
      <IconButton>
        <Badge badgeContent={notifications?.length ?? 0} color='info'>
          {notifications?.length > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>
    </>
  );
};

export default NotificationIcon;

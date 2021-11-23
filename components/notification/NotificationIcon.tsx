import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import { PartialNotification } from 'interfaces';
import NotificationMenu from './NotificationMenu';
import axios from 'axios';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';

const NotificationIcon = () => {
  const [session] = useSession();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const { data: notifications, isFetched, refetch } = useGet<PartialNotification[]>('/api/me/notifications', 'my-notifications');

  const { updateById } = useUpdateQueryById('my-notifications', handleUpdate, true);

  async function handleUpdate(id: number, attributes: Record<string, unknown>) {
    await axios.patch('/api/notifications/' + id, attributes);
  }

  const markRead = () => {
    for (const notification of notifications || []) {
      if (!notification.isRead) updateById(notification.id, { isRead: true });
    }
  };

  useEffect(() => {
    refetch();
  }, [session]);

  const unreadCount = notifications?.filter(notification => !notification.isRead).length || 0;

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications?.length > 0 ? unreadCount ?? 0 : 0} color='info'>
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>
      <NotificationMenu
        notifications={notifications}
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        onClose={markRead}
      ></NotificationMenu>
    </>
  );
};

export default NotificationIcon;

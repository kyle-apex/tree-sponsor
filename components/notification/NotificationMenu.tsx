import React from 'react';
import { PartialNotification } from 'interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationDisplay from './NotificationDisplay';
import { useRouter } from 'next/router';

const NotificationMenu = ({
  notifications,
  anchorEl,
  setAnchorEl,
  onClose,
}: {
  notifications: PartialNotification[];
  anchorEl: Element;
  setAnchorEl: (el: any) => void;
  onClose: () => void;
}) => {
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (link: string) => {
    router.push(link);
    setAnchorEl(null);
  };

  const handleClose = () => {
    onClose();
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ '.MuiMenu-paper': { width: '80vw', maxWidth: '500px' }, '.MuiMenu-list': { paddingTop: 0, paddingBottom: 0 } }}
      >
        {notifications?.map(notification => (
          <MenuItem
            key={notification.id}
            sx={{ backgroundColor: !notification.isRead ? '#d8e4e0' : '' }}
            onClick={() => handleClick(notification.link)}
          >
            <NotificationDisplay notification={notification} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default NotificationMenu;

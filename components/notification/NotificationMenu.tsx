import React, { ReactElement } from 'react';
import { PartialNotification } from 'interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationDisplay from './NotificationDisplay';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';

const NotificationMenu = ({
  notifications,
  anchorEl,
  setAnchorEl,
  onClose,
}: {
  notifications: PartialNotification[];
  anchorEl: null | Element | ((element: Element) => Element);
  setAnchorEl: (el: Element) => void;
  onClose: () => void;
}) => {
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (link: string) => {
    if (link) router.push(link);
    handleClose();
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
        sx={{ '.MuiMenu-paper': { width: '85vw', maxWidth: '500px' }, '.MuiMenu-list': { paddingTop: 0, paddingBottom: 0 } }}
      >
        {notifications?.map((notification, idx) => (
          <Box key={notification.id}>
            {idx > 0 && <hr style={{ margin: 0 }} />}
            <MenuItem
              sx={{
                backgroundColor: !notification.isRead ? '#d8e4e0' : '',
                paddingBottom: 1.5,
                paddingTop: 1.5,
                ':hover': { backgroundColor: !notification.isRead ? '#c7d6d1' : '' },
              }}
            >
              <NotificationDisplay notification={notification} onAction={link => handleClick(link)} />
            </MenuItem>
          </Box>
        ))}
        {notifications?.length == 0 && (
          <Box onClick={handleClose} sx={{ padding: 1 }}>
            No noficiations found
          </Box>
        )}
      </Menu>
    </>
  );
};
export default NotificationMenu;

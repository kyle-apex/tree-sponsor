import React from 'react';
import { PartialNotification } from 'interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationDisplay from './NotificationDisplay';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        sx={{ '.MuiMenu-paper': { width: '80vw', maxWidth: '500px' }, '.MuiMenu-list': { paddingTop: 0, paddingBottom: 0 } }}
      >
        {notifications?.map((notification, idx) => (
          <>
            {idx > 0 && <hr style={{ margin: 0 }} />}
            <MenuItem
              key={notification.id}
              sx={{
                backgroundColor: !notification.isRead ? '#d8e4e0' : '',
                paddingBottom: 1.5,
                paddingTop: 1.5,
                ':hover': { backgroundColor: !notification.isRead ? '#c7d6d1' : '' },
              }}
            >
              <NotificationDisplay notification={notification} onAction={link => handleClick(link)} />
            </MenuItem>
          </>
        ))}
        {notifications?.length == 0 && <Box sx={{ padding: 1 }}>No noficiations found</Box>}
      </Menu>
    </>
  );
};
export default NotificationMenu;

import MenuItem from '@mui/material/MenuItem';
import { PartialNotification } from 'interfaces';
import NotificationDisplay from './NotificationDisplay';

const NotificationMenuItem = ({
  index,
  notification,
  handleClick,
}: {
  index: number;
  notification: PartialNotification;
  handleClick: (link: string) => void;
}) => (
  <>
    {index > 0 && <hr style={{ margin: 0 }} />}
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
  </>
);
export default NotificationMenuItem;

import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { PartialUser } from 'interfaces';
import UserAvatar from './UserAvatar';

const UserDisplay = ({ user, disableLink, sx }: { user: PartialUser; disableLink?: boolean; sx?: SxProps<Theme> }) => {
  return (
    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', paddingRight: 1, paddingLeft: 1, ...sx }} gap={2}>
      <UserAvatar
        name={user?.displayName || user?.name}
        image={user?.image}
        link={user?.profilePath && !disableLink ? '/u/' + user?.profilePath : ''}
        size={36}
      />{' '}
      {user?.displayName || user?.name}
    </Box>
  );
};
export default UserDisplay;

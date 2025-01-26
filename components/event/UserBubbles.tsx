import Box from '@mui/material/Box';
import { UserAvatar } from 'components/sponsor';
import { PartialUser } from 'interfaces';

const UserBubbles = ({ users, maxLength, size, ml }: { users: PartialUser[]; maxLength?: number; size?: number; ml?: string | number }) => {
  const displayedUsers = maxLength ? users?.slice(0, maxLength) : users;
  return (
    <Box flexDirection='row' sx={{ gap: '5px', display: 'flex' }}>
      {displayedUsers?.map((user, idx) => {
        return (
          <Box key={user.id} ml={idx ? ml || -1.2 : 0}>
            <UserAvatar name={user?.displayName || user?.name} image={user?.image} size={size || 24} sx={{ border: 'solid 1px gray' }} />
          </Box>
        );
      })}
      {users?.length > maxLength && (
        <Box ml={-1.2}>
          <UserAvatar name={'+ ' + (users?.length - maxLength)} size={size || 24} sx={{ border: 'solid 1px gray' }} />
        </Box>
      )}
    </Box>
  );
};
export default UserBubbles;

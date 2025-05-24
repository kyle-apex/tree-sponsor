import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SupporterIcon from '@mui/icons-material/VerifiedSharp';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import { UserAvatar } from 'components/sponsor';

interface GuestListItemProps {
  user: PartialUser;
  index: number;
  isCurrentUser: boolean;
  currentUserStyles: object;
}

const GuestListItem: React.FC<GuestListItemProps> = ({ user, index, isCurrentUser, currentUserStyles }) => {
  return (
    <Box key={user.id} sx={isCurrentUser ? currentUserStyles : {}} className={isCurrentUser ? 'box-shadow' : ''}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <UserAvatar image={user.image} name={user.displayName || user.name} size={30} colorIndex={index} />
        <Typography variant='subtitle2'>{user.displayName || user.name}</Typography>
        {user.subscriptions?.length > 0 && <SupporterIcon fontSize='small' sx={{ ml: -1.5 }} color='primary'></SupporterIcon>}
      </Box>
      {isCurrentUser && (
        <Box mt={1} sx={{ lineHeight: 1.4, fontSize: '80%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupporterIcon fontSize='medium' sx={{ ml: 0 }} color='primary'></SupporterIcon>
          <Link href='/membership'>
            <Box>
              <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>Become a supporter</a> of planting trees with an annual $20
              donation to TreeFolks!
            </Box>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default GuestListItem;

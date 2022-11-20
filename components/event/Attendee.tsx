import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import Link from 'next/link';
import { PartialUser } from 'interfaces';
import RestrictSection from 'components/RestrictSection';
import DeleteIconButton from 'components/DeleteIconButton';

const userNameDisplay = ({ user }: { user: PartialUser }) => (
  <Typography
    variant='subtitle2'
    color={user.profilePath ? 'primary' : ''}
    className={user.profilePath ? 'clickable' : ''}
    sx={{ fontWeight: user.profilePath ? 600 : 500, textDecoration: user.profilePath ? 'underline' : '' }}
  >
    {user.displayName || user.name}
  </Typography>
);

const Attendee = ({ user, onDelete }: { user: PartialUser; onDelete: () => void }) => {
  const isCoreTeam = !!user.roles?.find(role => role.name == 'Core Team');
  // TODO: Remove This
  user.profilePath = null;
  return (
    <Box flexDirection='row' sx={{ display: 'flex' }} gap={2} mb={2}>
      <Box>
        <UserAvatar image={user.image} name={user.displayName || user.name} size={30} />
      </Box>
      <Box className='full-width'>
        <Box flexDirection='row' gap={1} sx={{ display: 'flex', marginBottom: 0.5, width: '100%', alignItems: 'center', height: '100%' }}>
          {user.profilePath && <Link href={'/u/' + user.profilePath}>{userNameDisplay({ user })}</Link>}
          {!user.profilePath && userNameDisplay({ user })}
          {isCoreTeam && (
            <Typography variant='subtitle2' color='gray'>
              Core Team
            </Typography>
          )}
          {!isCoreTeam && user.subscriptions?.length > 0 && (
            <Typography variant='subtitle2' color='gray'>
              Member
            </Typography>
          )}
          <RestrictSection accessType='isAdmin'>
            <DeleteIconButton onDelete={onDelete} tooltip='Remove Checkin'></DeleteIconButton>
          </RestrictSection>
        </Box>
      </Box>
    </Box>
  );
};
export default Attendee;

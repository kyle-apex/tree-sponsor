import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import { PartialUser } from 'interfaces';
type U = PartialUser & { count: number };
const TreeIdLeaderPosition = () => {
  const leaders: U[] = [
    { name: 'Cory', count: 0 },
    { name: 'Kyle', count: 1 },
    { name: 'Sean', count: 2 },
  ];
  return (
    <Box>
      {leaders.map((user, idx) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: -1.5 }} key={user.name}>
            <Typography sx={{ mr: 1 }}>{idx + 1}.</Typography>
            <Box sx={{ ml: idx == 1 ? 1 : 0 }}>
              <UserAvatar image={user.image} name={user.displayName || user.name} size={30} />
            </Box>

            <Typography variant='subtitle2' sx={{ marginLeft: 1 }}>
              {user.name}
            </Typography>
            <Typography variant='subtitle2' color='GrayText' sx={{ fontSize: '.8rem', marginLeft: 1 }}>
              Member
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
export default TreeIdLeaderPosition;
/*

<Grid container spacing={2}>
      {leaders.map((user, idx) => {
        return (
          <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} xs={4} key={user.name}>
            <Box sx={{ height: '40px', paddingTop: idx == 1 ? 0 : '5px' }} mb={0.5}>
              <UserAvatar image={user.image} name={user.displayName || user.name} size={idx == 1 ? 40 : 30} />
            </Box>
            <Typography variant='subtitle2'>{user.name}</Typography>
            <Typography variant='subtitle2' color='GrayText' sx={{ fontSize: '.8rem' }}>
              Tree IDs: {user.count}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
*/

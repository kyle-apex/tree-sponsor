import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Link from 'next/link';

import { LeaderRow } from 'interfaces';
import SplitRow from 'components/layout/SplitRow';

const TreeIdLeaderPosition = ({ leaders }: { leaders: LeaderRow[] }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '5px',
        mt: 1,
        pt: 1,
      }}
    >
      <SplitRow mb={1.5}>
        <Box sx={{ fontSize: '80%', pl: 0.5 }}>
          <Link href='/leaders'>
            <a
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'end',
                color: '#6e4854',
              }}
            >
              <LeaderboardIcon sx={{ fontSize: 'inherit' }}></LeaderboardIcon> View full leaderboard
            </a>
          </Link>
        </Box>
        <Box sx={{ mr: '5px', fontSize: '80%', color: '#6e4854' }}>Correct Guesses</Box>
      </SplitRow>
      <Box mb={2}>
        {leaders?.map((leader, idx) => {
          const user = leader.user;
          return (
            <Box
              className={leader.isCurrentUser ? 'box-shadow' : ''}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                pr: leader.isCurrentUser ? 2 : 2,
                backgroundColor: leader.isCurrentUser ? '#ffffff7d' : '',
                pt: '3px',
                pb: '3px',
                mb: '3px',
              }}
              key={user.name}
            >
              <Typography sx={{ fontWeight: 600, flex: '1 0 34px', textAlign: 'center', marginRight: 0.5 }}>
                {idx === 0 || leader.position != leaders[idx - 1].position ? leader.position : ''}
              </Typography>
              <Box>
                <UserAvatar image={user.image} name={user.displayName || user.name} size={idx == 1 ? 26 : 26} />
              </Box>

              <Typography variant='subtitle2' sx={{ ml: 1, flex: '1 1 100%' }}>
                {user.displayName || user.name}
              </Typography>

              <Typography
                variant='subtitle2'
                sx={{
                  textAlign: 'center',
                  background: 'linear-gradient(to top, #486e62, #486e62cc),url(/background-lighter.svg)',
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  flex: '1 0 44px',
                  fontWeight: 'bold',
                  fontSize: '.75rem',
                }}
                className='box-shadow'
              >
                {leader.count}
              </Typography>
            </Box>
          );
        })}
      </Box>
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

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Link from 'next/link';

import { LeaderRow, PartialUser } from 'interfaces';
import { useGet } from 'utils/hooks/use-get';
type U = PartialUser & { count: number; rank?: number };
const TreeIdLeaderPosition = ({ email }: { email: string }) => {
  const {
    data: leaders,
    isFetching,
    refetch,
    isFetched,
  } = useGet<LeaderRow[]>(
    `/api/leaders/user-quiz-ranking`,
    'leaderPosition',
    {
      email,
    },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );
  //const [leaders, setLeaders]
  /*const leaders: U[] = [
    { name: 'Cory', count: 0 },
    { name: 'Kyle', count: 1 },
    { name: 'Sean', count: 2 },
  ];*/
  return (
    <Box
      sx={{
        background: 'linear-gradient(to top, #486e624f, #486e6233), url(/background-lighter.svg)',
        pl: 1,
        height: '118px',
        position: 'relative',
        borderRadius: '5px',
        mt: 2,
        mb: 2,
      }}
      className='box-shadow'
    >
      <Box sx={{ position: 'absolute', left: '5px', top: '1px', fontSize: '80%' }}>
        <Link href='/leaders'>
          <a
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              display: 'flex',
              gap: '3px',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <LeaderboardIcon sx={{ fontSize: 'inherit' }}></LeaderboardIcon> View full leaderboard
          </a>
        </Link>
      </Box>
      <Box sx={{ position: 'absolute', right: '5px', top: '1px', fontSize: '80%' }}>Correct Guesses</Box>
      {leaders?.map((leader, idx) => {
        const user = leader.user;
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              top: 24 + idx * 28 + 'px',
              zIndex: idx == 1 ? 23 : 1,
              fontWeight: idx == 1 ? 600 : 400,
              width: '100%',
              pr: 3,
            }}
            key={user.name}
          >
            <Typography sx={{ fontWeight: 600, flex: '1 0 34px', textAlign: 'center', marginRight: 0.5 }}>
              {idx === 0 || leader.position != leaders[idx - 1].position ? leader.position : ''}
            </Typography>
            <Box sx={{ ml: idx == 1 ? '-2px' : 0, mt: idx == 1 ? '-2px' : 0 }}>
              <UserAvatar
                sx={{ border: idx == 1 ? 'solid 1px white' : null }}
                image={user.image}
                name={user.displayName || user.name}
                size={idx == 1 ? 34 : 30}
              />
            </Box>

            <Typography variant='subtitle2' sx={{ marginLeft: idx == 1 ? 1 : '10px', flex: '1 1 100%' }}>
              {user.displayName || user.name}
            </Typography>

            <Typography
              variant='subtitle2'
              sx={{
                textAlign: 'center',
                /*backgroundColor: '#486E62',*/
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

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import UserAvatar from 'components/sponsor/UserAvatar';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SupporterIcon from '@mui/icons-material/VerifiedSharp';
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';

import Link from 'next/link';

import { LeaderRow } from 'interfaces';
import SplitRow from 'components/layout/SplitRow';
import Skeleton from '@mui/material/Skeleton';
import { Dispatch, SetStateAction } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const TreeIdLeaderPosition = ({
  leaders,
  isLoading,
  showAll,
  setShowAll,
  leaderBoardMode,
  setLeaderBoardMode,
}: {
  leaders: LeaderRow[];
  isLoading?: boolean;
  showAll?: boolean;
  setShowAll?: Dispatch<SetStateAction<boolean>>;
  leaderBoardMode?: string;
  setLeaderBoardMode?: Dispatch<SetStateAction<string>>;
}) => {
  const hasFullLeaderBoardToggle = leaders?.length >= 3 && (leaders[2].position > 3 || leaders[2].count > 0 || leaders[0].position !== 0);
  //if (leaders?.length == 3 && leaders[2].position > 3)
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
          {false && (
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
          )}
          <ToggleButtonGroup
            size='small'
            value={leaderBoardMode}
            exclusive
            onChange={(_e, mode) => setLeaderBoardMode(mode)}
            aria-label='Current/All Leaderboard Mode'
            fullWidth
            color='secondary'
            sx={{ marginBottom: -0.2 }}
          >
            <ToggleButton value='' aria-label='Current' sx={{ fontSize: '10px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              Current Map
            </ToggleButton>
            <ToggleButton value='all' aria-label='All Time' sx={{ fontSize: '10px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              All Time
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ mr: '5px', fontSize: '80%', color: '#6e4854' }}>Correct Guesses</Box>
      </SplitRow>
      <Box mb={2}>
        {(!leaders?.length || isLoading) && (
          <Box pr={2} pl={2}>
            <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 1.5 }} height={26} />
            <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 1.5 }} height={26} />
            <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 1.5 }} height={26} />
          </Box>
        )}
        {!isLoading &&
          leaders?.map((leader, idx) => {
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
                <Box sx={{ fontWeight: 600, flex: '1 0 40px', textAlign: 'center', marginRight: 0.5 }}>
                  <Typography sx={{ display: 'inline' }}>
                    {idx === 0 || leader.position != leaders[idx - 1].position ? leader.position : ''}
                  </Typography>
                  {(idx === 0 || leader.position != leaders[idx - 1].position) && (
                    <sup style={{ fontSize: '50%', fontWeight: 400, display: 'inline' }}>
                      {String(leader.position).endsWith('1')
                        ? 'st'
                        : String(leader.position).endsWith('2')
                        ? 'nd'
                        : String(leader.position).endsWith('3')
                        ? 'rd'
                        : 'th'}
                    </sup>
                  )}
                </Box>
                <Box>
                  <UserAvatar image={user.image} name={user.displayName || user.name} size={idx == 1 ? 26 : 26} />
                </Box>

                <Typography
                  variant='subtitle2'
                  sx={{ ml: 1, flex: '1 1 100%', display: 'flex', alignContent: 'center', alignItems: 'center', gap: '5px', pr: 0.5 }}
                >
                  {user.displayName || user.name} {leader.isMember && <SupporterIcon fontSize='small' color='primary'></SupporterIcon>}
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
      {hasFullLeaderBoardToggle && (
        <Box mt={-1} mb={0.25}>
          <a
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              display: 'flex',
              gap: '3px',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6e4854',
              fontSize: '80%',
            }}
            onClick={() => {
              setShowAll((current: boolean) => !current);
            }}
          >
            {!showAll ? (
              <>
                {' '}
                <ChevronDownIcon sx={{ fontSize: 'inherit' }}></ChevronDownIcon> Show Full Leaderboard{' '}
                <ChevronDownIcon sx={{ fontSize: 'inherit' }}></ChevronDownIcon>
              </>
            ) : (
              <>
                <ChevronUpIcon sx={{ fontSize: 'inherit' }}></ChevronUpIcon> Hide Full Leaderboard{' '}
                <ChevronUpIcon sx={{ fontSize: 'inherit' }}></ChevronUpIcon>
              </>
            )}
          </a>
        </Box>
      )}
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

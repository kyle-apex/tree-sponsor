import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SplitRow from 'components/layout/SplitRow';
import { LeaderRow, PartialEvent } from 'interfaces';
import { useState } from 'react';
import formatDateString from 'utils/formatDateString';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import TreeIdQuiz from './TreeIdQuiz';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useGet } from 'utils/hooks/use-get';
import PinIcon from '@mui/icons-material/LocationOn';
import TreeIdLeaderPosition from './TreeIdLeaderPosition';

const PriorEventQuiz = ({ event }: { event?: PartialEvent }) => {
  const [email, setEmail] = useLocalStorage('checkinEmail', '');
  const [isFirstQuiz, setIsFirstQuiz] = useState(true);
  const [isQuizRefreshing, setIsQuizRefreshing] = useState(false);

  const { data: leaders, refetch: refetchLeaders } = useGet<LeaderRow[]>(
    `/api/leaders/user-quiz-ranking`,
    'leaderPosition',
    {
      email,
    },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const onQuizDialogClose = () => {
    refetchLeaders();
    setIsFirstQuiz(false);
  };

  return (
    <>
      <Box sx={{ textAlign: 'center', mt: -1 }}>
        <EventNameDisplay isRecap={true} name={event?.name} />
        <Typography variant='subtitle2' sx={{ fontSize: '.75rem' }} color='gray' mb={2}>
          {formatDateString(event?.startDate)}
          {event.location?.name && ' - ' + event.location.name}
        </Typography>
        {!email && (
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }}
            label='Email Address'
            placeholder='me@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            size='small'
            fullWidth
            required
            sx={{ mb: 3 }}
          ></TextField>
        )}
      </Box>
      <Box
        sx={{
          background: 'linear-gradient(to top, #486e624f, #486e6233), url(/background-lighter.svg)',
          border: 'solid 1px #486E62',
          borderRadius: '5px',
        }}
        className='box-shadow checkin-tree-quiz'
        mb={3}
      >
        <Typography variant='h6' color='primary' sx={{ textAlign: 'center' }} mb={2} mt={1}>
          Tree ID Guessing Game
        </Typography>

        <Box sx={{ textAlign: 'right', mt: -1.5, mb: 0.2, fontSize: '80%', pl: 0.5, pr: 0.5 }}>
          <a
            onClick={() => {
              setIsQuizRefreshing(true);
            }}
            style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', color: '#6e4854' }}
          >
            <AutorenewIcon sx={{ fontSize: 'inherit' }} /> <Box sx={{ textDecoration: 'underline' }}>Reload</Box>
          </a>
        </Box>
        <TreeIdQuiz
          eventId={event.id}
          isRefreshing={isQuizRefreshing}
          defaultLatitude={Number(event.location?.latitude)}
          defaultLongitude={Number(event.location?.longitude)}
          setIsRefreshing={setIsQuizRefreshing}
          mapHeight='250px'
          onCloseDialog={onQuizDialogClose}
        ></TreeIdQuiz>
        {isFirstQuiz && (
          <Box sx={{ mt: -4, fontSize: '95%', zIndex: 1000, position: 'relative' }}>
            <Box
              style={{
                textDecoration: 'none',
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#486e62',
                padding: '3px 5px',
                backgroundColor: '#FFCC37',
                borderRadius: '16px',
                width: '160px',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className='box-shadow'
            >
              <PinIcon sx={{ fontSize: 'inherit' }}></PinIcon> Tap a pin to begin
            </Box>
          </Box>
        )}

        <TreeIdLeaderPosition leaders={leaders}></TreeIdLeaderPosition>
      </Box>
    </>
  );
};
export default PriorEventQuiz;

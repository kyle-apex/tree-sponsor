import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SplitRow from 'components/layout/SplitRow';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields } from 'interfaces';
import { useEffect, useRef, useState } from 'react';
import formatDateString from 'utils/formatDateString';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import TreeIdQuiz from './TreeIdQuiz';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useGet } from 'utils/hooks/use-get';
import PinIcon from '@mui/icons-material/LocationOn';
import TreeIdLeaderPosition from './TreeIdLeaderPosition';
import Button from '@mui/material/Button';
import parsedGet from 'utils/api/parsed-get';
import CheckinForm, { CheckinFormHandle } from './CheckinForm';
import PriorEventList from './PriorEventList';

const PriorEventQuiz = ({ event }: { event?: PartialEvent }) => {
  const [storedEmail, setStoredEmail] = useLocalStorage('checkinEmail', '');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const [isFirstQuiz, setIsFirstQuiz] = useState(true);
  const [isQuizRefreshing, setIsQuizRefreshing] = useState(false);

  const checkinFormRef = useRef<CheckinFormHandle>();

  const attemptSignIn = async (fields: CheckinFields) => {
    setIsLoading(true);
    const url = `/api/events/quiz-signin?email=${encodeURIComponent(fields?.email || storedEmail)}&firstName=${encodeURIComponent(
      fields?.firstName || '',
    )}&lastName=${encodeURIComponent(fields?.lastName || '')}&discoveredFrom=${encodeURIComponent(
      fields?.discoveredFrom || '',
    )}&emailOptIn=${fields?.isEmailOptIn || ''}`;
    const results = (await parsedGet(url)) as MembershipStatus;
    console.log('results', results);
    if (results?.email) {
      setStoredEmail(results.email);
    }
    setIsLoggedIn(!!results?.email);
    setIsUserNotFound(!results?.email);
    setIsLoading(false);
  };

  const {
    data: leaders,
    refetch: refetchLeaders,
    isFetching,
  } = useGet<LeaderRow[]>(
    `/api/leaders/user-quiz-ranking`,
    'leaderPosition',
    {
      email: storedEmail,
      eventId: null,
      showAll: false,
    },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const onQuizDialogClose = () => {
    refetchLeaders();
    setIsFirstQuiz(false);
  };

  const logout = () => {
    checkinFormRef?.current?.reset();
    setIsLoggedIn(false);
    setStoredEmail(null);
  };

  useEffect(() => {
    console.log('effect', storedEmail);
    if (storedEmail) setIsLoggedIn(true);
  }, [storedEmail]);

  return (
    <>
      <Box sx={{ textAlign: 'center', mt: -1 }}>
        <EventNameDisplay isRecap={true} name={event?.name} />
        <Typography variant='subtitle2' sx={{ fontSize: '.75rem' }} color='gray' mb={2}>
          {formatDateString(event?.startDate)}
          {event.location?.name && ' - ' + event.location.name}
        </Typography>
        {!isLoggedIn && (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1, textAlign: 'left' }}>
              Check-in to save your tree ID results:
            </Typography>
            <Box>
              <CheckinForm
                onSubmit={attemptSignIn}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading}
                ref={checkinFormRef}
                newUserLabel='New User'
                existingUserLabel='Existing'
              ></CheckinForm>
            </Box>
            {isUserNotFound && activeTab === 1 && (
              <Typography variant='body2' sx={{ mt: 1, textAlign: 'left' }}>
                E-mail address not found. Please try again or click &quot;New User&quot; to check-in for the first time.
              </Typography>
            )}
          </>
        )}
      </Box>
      <Box
        sx={{
          background: 'linear-gradient(to top, #486e624f, #486e6233), url(/background-lighter.svg)',
          border: 'solid 1px #486E62',
          borderRadius: '5px',
          position: 'relative',
        }}
        className='box-shadow checkin-tree-quiz'
        mb={3}
        mt={isLoggedIn ? 0 : 3}
      >
        {!isLoggedIn && (
          <Box
            sx={{
              zIndex: 6000,
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              backgroundColor: '#808080e8',
              color: 'white',
              display: 'flex',
            }}
          >
            <Box sx={{ margin: 'auto', width: '80%', justifySelf: 'center', fontSize: '20px' }}>
              Enter your email address above to record your results
            </Box>
          </Box>
        )}
        <Typography variant='h6' color='primary' sx={{ textAlign: 'center' }} mb={2} mt={1}>
          Tree ID Guessing Game
        </Typography>

        {isLoggedIn && (
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
        )}
        <Box>
          <TreeIdQuiz
            eventId={event.id}
            isRefreshing={isQuizRefreshing}
            defaultLatitude={Number(event.location?.latitude)}
            defaultLongitude={Number(event.location?.longitude)}
            setIsRefreshing={setIsQuizRefreshing}
            mapHeight='250px'
            onCloseDialog={onQuizDialogClose}
          ></TreeIdQuiz>
        </Box>
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

        <TreeIdLeaderPosition isLoading={isFetching} leaders={leaders}></TreeIdLeaderPosition>
      </Box>
      {isLoggedIn && <PriorEventList currentEventId={event.id}></PriorEventList>}
      {isLoggedIn && (
        <Button onClick={logout} sx={{ mt: 1 }} variant='outlined' color='secondary'>
          Log out
        </Button>
      )}
    </>
  );
};
export default PriorEventQuiz;

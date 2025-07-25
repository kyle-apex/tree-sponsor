import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields } from 'interfaces';
import { useEffect, useRef, useState } from 'react';
import formatDateString from 'utils/formatDateString';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import TreeIdQuiz from './TreeIdQuiz';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useGet } from 'utils/hooks/use-get';
import TreeIdLeaderPosition from './TreeIdLeaderPosition';
import Button from '@mui/material/Button';
import parsedGet from 'utils/api/parsed-get';
import CheckinForm, { CheckinFormHandle } from './CheckinForm';
import PriorEventList from './PriorEventList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useHash from 'utils/hooks/use-hash';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { InstagramEmbed } from 'react-social-media-embed';

const PriorEventQuiz = ({ event }: { event?: PartialEvent }) => {
  const [storedEmail, setStoredEmail] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCheckinTab, setActiveCheckinTab] = useState(storedEmail ? 1 : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const [showAllLeaders, setShowAllLeaders] = useState(false);
  const [leaderBoardMode, setLeaderBoardMode] = useState('');
  const [hasFloatingTabs, setHasFloatingTabs] = useState(false);
  const [floatingTabsWidth, setFloatingTabsWidth] = useState(300);
  const tabsRef = useRef<HTMLElement>();

  const [isQuizRefreshing, setIsQuizRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useHash(event.instagramPostId ? 'overview' : 'trees', ['overview', 'trees']);

  const checkinFormRef = useRef<CheckinFormHandle>();

  const attemptSignIn = async (fields: CheckinFields) => {
    setIsLoading(true);
    const url = `/api/events/quiz-signin?email=${encodeURIComponent(fields?.email || storedEmail)}&firstName=${encodeURIComponent(
      fields?.firstName || '',
    )}&lastName=${encodeURIComponent(fields?.lastName || '')}&discoveredFrom=${encodeURIComponent(
      fields?.discoveredFrom || '',
    )}&emailOptIn=${fields?.isEmailOptIn || ''}`;
    const results = (await parsedGet(url)) as MembershipStatus;

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
      eventId: leaderBoardMode != 'all' ? event.id : null,
      showAll: showAllLeaders,
    },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const isMember = !!leaders?.find(leader => {
    return leader.isCurrentUser && leader.isMember;
  });

  const onQuizDialogClose = () => {
    refetchLeaders();
  };

  const logout = () => {
    checkinFormRef?.current?.reset();
    setIsLoggedIn(false);
    setStoredEmail(undefined);
  };

  useEffect(() => {
    if (storedEmail) setIsLoggedIn(true);
  }, [storedEmail]);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setActiveTab(newValue);
    tabsRef?.current.scrollIntoView();
  };

  useEffect(() => {
    if (!event.instagramPostId) return;

    const handleScroll = (_event: any) => {
      const tabsRect = tabsRef?.current?.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      setFloatingTabsWidth(tabsRect.width);
      const scrollTop = tabsRect.top + bodyRect.top * -1;
      setHasFloatingTabs(bodyRect.top * -1 > scrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [event.instagramPostId]);
  const url = 'https://www.instagram.com/p/' + event.instagramPostId + '/';
  return (
    <>
      <Box sx={{ textAlign: 'center', mt: -1 }}>
        <EventNameDisplay isRecap={true} name={event?.name} />
        <Typography variant='subtitle2' sx={{ fontSize: '.75rem' }} color='gray' mb={2}>
          {formatDateString(event?.startDate)}
          {event.location?.name && ' - ' + event.location.name}
        </Typography>

        {event.instagramPostId && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={2} ref={tabsRef}>
              <Tabs
                className='account-tabs'
                value={activeTab}
                onChange={handleTabChange}
                variant='fullWidth'
                aria-label='basic tabs example'
              >
                <Tab
                  value='overview'
                  sx={{ borderTopLeftRadius: '5px' }}
                  label={
                    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div>📸&nbsp;&nbsp;Overview</div>
                    </Box>
                  }
                />
                <Tab
                  value='trees'
                  label={
                    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div>🌳&nbsp;&nbsp;Trees</div>
                    </Box>
                  }
                  sx={{ borderTopRightRadius: '5px' }}
                />
              </Tabs>
            </Box>
            {hasFloatingTabs && (
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider', zIndex: 1200, width: floatingTabsWidth + 'px' }}
                mb={2}
                className={'checkin-floating-tabs'}
              >
                <Tabs
                  className='account-tabs'
                  value={activeTab}
                  onChange={handleTabChange}
                  variant='fullWidth'
                  aria-label='basic tabs example'
                >
                  <Tab
                    value='overview'
                    label={
                      <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div>📸&nbsp;&nbsp;Overview</div>
                      </Box>
                    }
                  />
                  <Tab
                    value='trees'
                    label={
                      <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div>🌳&nbsp;&nbsp;Trees</div>
                      </Box>
                    }
                  />
                </Tabs>
              </Box>
            )}
          </>
        )}
        {activeTab == 'overview' && event.instagramPostId && (
          <Box mb={3}>
            <InstagramEmbed url={'https://www.instagram.com/p/' + event.instagramPostId + '/'} width='100%' captioned />
            <Box
              sx={{
                background: 'linear-gradient(to top, #486e624f, #486e6233), url(/background-lighter.svg)',
                border: 'solid 1px #486E62',
                borderRadius: '5px',
                p: 2,
                mt: 4,
              }}
              className='box-shadow checkin-tree-quiz'
            >
              <Typography variant='h6' color='primary' sx={{ textAlign: 'center' }} mb={2}>
                Tree ID Guessing Game
              </Typography>
              <Typography variant='body2' mb={2}>
                We map the trees at our events to help learn about our surroundings.{' '}
              </Typography>
              <Typography variant='body2'>Try the Tree ID Guessing Game to test your knowledge or learn something new:</Typography>
              <Button
                sx={{ cursor: 'pointer', mt: 2 }}
                variant='contained'
                color='primary'
                onClick={() => {
                  setActiveTab('trees');
                  tabsRef?.current.scrollIntoView();
                }}
                fullWidth
              >
                <SearchIcon sx={{ fontSize: '16px', mr: 0.75 }}></SearchIcon>Identify this event&apos;s trees
              </Button>
            </Box>
          </Box>
        )}
        {!isLoggedIn && activeTab == 'trees' && (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1, textAlign: 'left' }}>
              Check-in to save your Tree ID Guessing Game results:
            </Typography>
            <Box>
              <CheckinForm
                onSubmit={attemptSignIn}
                activeTab={activeCheckinTab}
                setActiveTab={setActiveCheckinTab}
                isLoading={isLoading}
                ref={checkinFormRef}
                newUserLabel='New User'
                existingUserLabel='Existing'
                isPastEvent={true}
              ></CheckinForm>
            </Box>
            {isUserNotFound && activeCheckinTab === 1 && (
              <Typography variant='body2' sx={{ mt: 1, textAlign: 'left' }}>
                E-mail address not found. Please try again or click &quot;New User&quot; to check-in for the first time.
              </Typography>
            )}
          </>
        )}
      </Box>
      {activeTab == 'trees' && (
        <Box
          sx={{
            background: 'linear-gradient(to top, #486e624f, #486e6233), url(/background-lighter.svg)',
            border: 'solid 1px #486E62',
            position: 'relative',
          }}
          className='box-shadow checkin-tree-quiz'
          mb={3}
          mt={isLoggedIn ? 0 : 3}
        >
          {!isLoggedIn && (
            <Box
              sx={{
                zIndex: 1200,
                position: 'absolute',
                bottom: -2,
                left: 0,
                height: '60px',
                width: '100%',
                backgroundColor: '#808080e8',
                color: 'white',
                display: 'flex',
              }}
            >
              <Box sx={{ margin: 'auto', width: '80%', justifySelf: 'center', fontSize: '20px', textAlign: 'center' }}>
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
                  //window.location.reload();
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
              event={event}
              isRefreshing={isQuizRefreshing}
              defaultLatitude={Number(event.location?.latitude)}
              defaultLongitude={Number(event.location?.longitude)}
              setIsRefreshing={setIsQuizRefreshing}
              mapHeight='300px'
              onCloseDialog={onQuizDialogClose}
            ></TreeIdQuiz>
          </Box>

          {isLoggedIn && (
            <TreeIdLeaderPosition
              isLoading={isFetching}
              leaders={leaders}
              setShowAll={setShowAllLeaders}
              showAll={showAllLeaders}
              leaderBoardMode={leaderBoardMode}
              setLeaderBoardMode={setLeaderBoardMode}
            ></TreeIdLeaderPosition>
          )}
        </Box>
      )}
      {!isMember && !isFetching && (
        <Box
          sx={{
            background: 'linear-gradient(to top, #6e485430, #6e48541a),url(/background-lighter.svg)',
            border: 'solid 1px #6e4854',
            borderRadius: '5px',
            p: 2,
            mt: 1,
            mb: 2,
          }}
          className='box-shadow checkin-tree-quiz'
        >
          <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
            Support Austin&apos;s Trees!
          </Typography>
          <Typography variant='body2' mb={2}>
            TreeFolks is Austin&apos; tree planting nonprofit to help ensure a shady, green, and beautiful future.
          </Typography>
          <Typography variant='body2'>
            Be a lasting part of that future by becoming a Supporting Member with a $20/yr annual donation:
          </Typography>
          <Link href='/membership'>
            <Button sx={{ cursor: 'pointer', mt: 2 }} variant='contained' color='secondary' fullWidth>
              Become a Supporting Member
            </Button>
          </Link>
        </Box>
      )}
      {isLoggedIn && <PriorEventList currentEventId={event.id} hasTreeQuizByDefault={activeTab != 'overview'}></PriorEventList>}
      {isLoggedIn && (
        <Button onClick={logout} sx={{ mt: 1 }} variant='outlined' color='secondary'>
          Log out
        </Button>
      )}
    </>
  );
};
export default PriorEventQuiz;

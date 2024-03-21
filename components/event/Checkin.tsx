import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState, useRef, useContext } from 'react';
import LoadingButton from '../LoadingButton';
import parsedGet from 'utils/api/parsed-get';
import Link from 'next/link';
import Button from '@mui/material/Button';
import SplitRow from 'components/layout/SplitRow';
import useLocalStorage from 'utils/hooks/use-local-storage';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useRouter } from 'next/router';

import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import {
  PartialEvent,
  PartialUser,
  PartialTree,
  Coordinate,
  PartialSpecies,
  PartialEventCheckIn,
  PartialSubscription,
  LeaderRow,
  MembershipStatus,
  CheckinFields,
} from 'interfaces';
import Attendees from './Attendees';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';
import { useGet } from 'utils/hooks/use-get';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import axios from 'axios';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import formatDateString from 'utils/formatDateString';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoupeIcon from '@mui/icons-material/Loupe';
import dynamic from 'next/dynamic';
import CheckinHistoryDialog from './CheckinHistoryDialog';
import useHashToggle from 'utils/hooks/use-hash-toggle';
import useWindowFocus from 'utils/hooks/use-window-focus';
import EventNameDisplay from './EventNameDisplay';
import TreeIdQuiz, { TreeIdQuizHandle } from './TreeIdQuiz';
import BecomeAMemberDialog from './BecomeAMemberDialog';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PinIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';

import TreeIdLeaderPosition from './TreeIdLeaderPosition';
import CheckinForm, { CheckinFormHandle } from './CheckinForm';
import { Router } from 'next/router';
import CheckinSessionProvider, { CheckinSessionContext } from './CheckinSessionProvider';
import EditSessionTreesDialog from 'components/tree/EditSessionTreesDialog';
//import TreeIdLeaderPosition from './TreeIdLeaderPosition';
const MapMarkerDisplay = dynamic(() => import('components/maps/MapMarkerDisplay'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Skeleton variant='rectangular' sx={{ width: '100%' }} height={200} />,
});
const IdentifyTreeFlowDialog = dynamic(() => import('components/tree/IdentifyTreeFlowDialog'), {
  ssr: false,
});

const getDonationDateMessage = (subscription: PartialSubscription): string => {
  const anniversary = new Date(subscription.lastPaymentDate);
  anniversary.setFullYear(anniversary.getFullYear() + 1);
  const anniversaryNumber = Math.max(1, anniversary.getFullYear() - subscription.createdDate.getFullYear());

  return `Your ${anniversaryNumber}${
    anniversaryNumber == 1 ? 'st' : anniversaryNumber == 2 ? 'nd' : anniversaryNumber == 3 ? 'rd' : 'th'
  } TreeFolksYP Membership anniversary donation will be ${formatDateString(anniversary)}.`;
};

const attendeesDisplayLimit = 50;

const Checkin = ({ event }: { event?: PartialEvent }) => {
  const router = useRouter();
  const [email, setEmail] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const { sessionId } = useContext(CheckinSessionContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTreeDialogOpen, setIsAddTreeDialogOpen] = useState(false);
  const [isEditTreeDialogOpen, setIsEditTreeDialogOpen] = useState(false);
  const [isQuizRefreshing, setIsQuizRefreshing] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useHashToggle('history', false);
  const [isMembershipDialogOpen, setIsMembershipDialogOpen] = useState(false);

  const [selectedTree, setSelectedTree] = useState<PartialTree>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExistingUser, setIsLoadingExistingUser] = useState(false);

  const [status, setStatus] = useState<MembershipStatus>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [isShowAllAttendees, setIsShowAllAttendees] = useState(false);

  const [showAllLeaders, setShowAllLeaders] = useState(false);
  const [leaderBoardMode, setLeaderBoardMode] = useState('');

  const [hasTrees, setHasTrees] = useState(null);
  const onFetchedTrees = useCallback(async (trees: PartialTree[]) => {
    setHasTrees(!!trees?.length);
  }, []);

  const checkinFormRef = useRef<CheckinFormHandle>();
  const treeIdQuizHandle = useRef<TreeIdQuizHandle>();

  // Preload species to immediately have quiz options
  const { data: prioritySpecies, isFetched } = useGet<PartialSpecies>(
    '/api/species/priority',
    'prioritySpecies',
    {},
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  useWindowFocus(async () => {
    if (status?.attendees?.length > 0) {
      const result = (await parsedGet(`/api/events/${event.id}/attendees?email=${encodeURIComponent(email)}`)) as PartialUser[];
      setStatus(current => {
        if (!current) return current;
        return { ...current, ...result };
      });
    }
  }, [status]);

  useEffect(() => {
    console.log('email', email);
    if (!email) return;

    setIsLoadingExistingUser(true);
    getMembershipStatus();
  }, [event?.id]);

  const getMembershipStatus = async (fields?: CheckinFields) => {
    setIsLoading(true);
    if (fields?.email) setEmail(fields.email);
    const url = `/api/events/${event.id}/checkin?email=${encodeURIComponent(fields?.email || email)}&firstName=${encodeURIComponent(
      fields?.firstName || '',
    )}&lastName=${encodeURIComponent(fields?.lastName || '')}&discoveredFrom=${encodeURIComponent(
      fields?.discoveredFrom || '',
    )}&emailOptIn=${fields?.isEmailOptIn || ''}`;
    const result = (await parsedGet(url)) as MembershipStatus;

    let status;
    if (result?.subscription) status = { ...result, isFound: true };
    else status = { ...result, isFound: false, email };

    // redirect to the past page if this is a previous event
    const startOfToday = new Date();
    startOfToday.setHours(0);
    if (!status.myCheckin && event.startDate < startOfToday) {
      router.push(`/e/${event.path}/quiz#trees`);
      return;
    }

    setStatus(status);
    setIsPrivate(status.myCheckin?.isPrivate);

    setIsLoading(false);
  };

  const onDeleteCheckin = async (userId: number) => {
    await axios.delete(`/api/events/delete-checkin?userId=${userId}&eventId=${event.id}`);
    // do not reload if removing your own checkin
    if (status?.myCheckin?.userId != userId) getMembershipStatus();
  };

  const reset = async () => {
    setStatus(null);
    setEmail('');
    setActiveTab(0);
    setIsLoadingExistingUser(null);
    checkinFormRef?.current?.reset();
  };

  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 366);

  const hasActiveMembership = status?.subscription?.lastPaymentDate > lastYear;

  const userName = status?.subscription?.userName?.split(' ')[0] || status?.myCheckin?.user?.name?.split(' ')[0] || '';

  const updateIsPrivate = async () => {
    const newIsPrivate = !isPrivate;
    setIsPrivate(newIsPrivate);
    await axios.patch('/api/me/checkin/' + status.myCheckin.id, { isPrivate: newIsPrivate });
    getMembershipStatus();
  };

  const {
    data: leaders,
    refetch: refetchLeaders,
    isFetching: isFetchingLeaders,
  } = useGet<LeaderRow[]>(
    `/api/leaders/user-quiz-ranking`,
    'leaderPosition',
    {
      email,
      eventId: leaderBoardMode != 'all' ? event.id : null,
      showAll: showAllLeaders,
    },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const onQuizDialogClose = () => {
    refetchLeaders();
  };

  return (
    <>
      {isLoadingExistingUser && !status && (
        <Box>
          <Skeleton
            variant='text'
            sx={{ width: '45%', textAlign: 'center', marginBottom: 2, marginLeft: 'auto', marginRight: 'auto' }}
            height={30}
          />
          <Skeleton variant='text' sx={{ width: '100%', marginBottom: 1 }} height={25} />
          <Skeleton variant='text' sx={{ width: '100%', marginBottom: 1 }} height={25} />
          <Skeleton variant='text' sx={{ width: '100%', marginBottom: 1 }} height={25} />
        </Box>
      )}
      {status == null && !isLoadingExistingUser && (
        <>
          {false && (
            <Typography variant='h2' color='secondary' sx={{ textAlign: 'center' }}>
              Welcome!
            </Typography>
          )}
          <EventNameDisplay name={event?.name} />
          <Typography variant='subtitle2' sx={{ fontSize: '.75rem' }} color='gray' mb={2}>
            {formatDateString(event?.startDate)}
            {event.location?.name && ' - ' + event.location.name}
          </Typography>
          <Typography variant='subtitle2' mb={2}>
            Welcome! Please check in below to learn more about this event and the trees around you.
          </Typography>
          <CheckinForm
            onSubmit={getMembershipStatus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
            ref={checkinFormRef}
          ></CheckinForm>
        </>
      )}

      {status && (
        <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
          Welcome{userName ? ' ' + userName : ''}!
        </Typography>
      )}
      {status && event?.checkInDetails && event.checkInDetails != '<p><br></p>' && (
        <>
          <Typography variant='body2' component='div' mt={-2}>
            <SafeHTMLDisplay html={event?.checkInDetails}></SafeHTMLDisplay>
          </Typography>
          <hr style={{ width: '100%', marginTop: '10px', marginBottom: '20px' }} />
        </>
      )}

      {status?.isFound === false && activeTab == 1 && !status.myCheckin?.user?.name && (
        <>
          <Typography variant='body2' component='p' mb={2}>
            Supporting membership status for <b>{status.email}</b> was not found.
          </Typography>
          <Typography variant='body2' component='p' mb={3}>
            Click the &quot;Try Another Search&quot; button below to try another e-mail address.
          </Typography>
          <Button onClick={reset} variant='contained' color='secondary' sx={{ marginBottom: 3 }}>
            Try Another Search
          </Button>
        </>
      )}
      {status?.isFound === false && (activeTab == 0 || status.myCheckin?.user?.name) && (
        <>
          <Typography variant='body2' component='p' mb={4}>
            Thanks for joining for today&apos;s event. Grab a name tag (if available), meet a new friend, and learn about the trees around
            us:
          </Typography>
        </>
      )}

      {status?.isFound && (
        <>
          {hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                🌳 &nbsp;Thanks for continuing to support the urban forest with your supporting membership donation to TreeFolks!
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                🥳 &nbsp;{getDonationDateMessage(status.subscription)}
              </Typography>
              <Typography variant='body2' component='p' mb={status.myCheckin?.user?.roles?.find(role => role.name === 'Core Team') ? 2 : 4}>
                👥 &nbsp;Keep up with special events and opportunities in our
                <a href={process.env.BAND_URL || 'https://band.tfyp.org'} target='_blank' rel='noreferrer' style={{}}>
                  <span style={{ marginLeft: '4px' }}>members only BAND App community</span>
                </a>
                .
              </Typography>
            </>
          )}
          {!hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                Thank you for your support.
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Unfortunately <b>your supporting membership is no longer active</b>.
              </Typography>
              <Typography variant='body2' component='p' mb={3}>
                Your most recent membership donation was {formatDateString(status.subscription.lastPaymentDate)}.{' '}
                <Link href='/membership'>
                  <a style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    Click here to start a new supporting membership donation to TreeFolks!
                  </a>
                </Link>
                {'.'}
              </Typography>
            </>
          )}
        </>
      )}
      {status && !(status.isFound === false && !status.myCheckin?.user?.name && activeTab == 1) && (
        <>
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
              <SplitRow>
                {hasTrees ? (
                  <a
                    onClick={() => {
                      //window.location.reload();
                      setIsQuizRefreshing(true);
                    }}
                    style={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      color: '#6e4854',
                    }}
                  >
                    <AutorenewIcon sx={{ fontSize: 'inherit' }} /> <Box sx={{ textDecoration: 'underline' }}>Reload</Box>
                  </a>
                ) : (
                  <></>
                )}
                <a
                  onClick={() => {
                    if (!hasActiveMembership) {
                      setIsMembershipDialogOpen(true);
                    } else setIsAddTreeDialogOpen(true);
                  }}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '3px',
                    alignItems: 'center',
                    color: '#6e4854',
                  }}
                >
                  <LoupeIcon sx={{ fontSize: 'inherit' }}></LoupeIcon> <Box sx={{ textDecoration: 'underline' }}>Add a tree</Box>
                </a>
              </SplitRow>
              <BecomeAMemberDialog open={isMembershipDialogOpen} setOpen={setIsMembershipDialogOpen}></BecomeAMemberDialog>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <TreeIdQuiz
                ref={treeIdQuizHandle}
                eventId={event.id}
                event={event}
                isRefreshing={isQuizRefreshing}
                defaultLatitude={Number(event.location?.latitude)}
                defaultLongitude={Number(event.location?.longitude)}
                setIsRefreshing={setIsQuizRefreshing}
                mapHeight='300px'
                onCloseDialog={onQuizDialogClose}
                onFetched={onFetchedTrees}
              ></TreeIdQuiz>
              {hasTrees === false && (
                <Box
                  sx={{
                    zIndex: 1001,
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
                  <Box sx={{ margin: 'auto', width: '90%', justifySelf: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '18px', lineHeight: 1.2 }}>
                      Return to this page later in the event to test your memory!
                    </Typography>
                    <Typography sx={{ fontSize: '12px', mt: 0.2 }}>(Scan QR or visit checkin.tfyp.org)</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {sessionId && (
              <Box sx={{ textAlign: 'center', fontSize: '80%', mt: 1, mb: hasTrees ? -1 : 1, mr: 0.5 }}>
                <a
                  onClick={() => {
                    setIsEditTreeDialogOpen(true);
                  }}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '3px',
                    justifyContent: 'right',
                    color: '#6e4854',
                  }}
                >
                  <EditIcon sx={{ fontSize: 'inherit' }}></EditIcon> <Box sx={{ textDecoration: 'underline' }}>Edit Added Tree(s)</Box>
                </a>
                <EditSessionTreesDialog
                  isOpen={isEditTreeDialogOpen}
                  setIsOpen={setIsEditTreeDialogOpen}
                  onComplete={() => {
                    setIsQuizRefreshing(true);
                  }}
                ></EditSessionTreesDialog>
              </Box>
            )}
            {hasTrees && (
              <TreeIdLeaderPosition
                isLoading={isFetchingLeaders}
                leaders={leaders}
                setShowAll={setShowAllLeaders}
                showAll={showAllLeaders}
                leaderBoardMode={leaderBoardMode}
                setLeaderBoardMode={setLeaderBoardMode}
              ></TreeIdLeaderPosition>
            )}
            <IdentifyTreeFlowDialog
              open={isAddTreeDialogOpen}
              setOpen={setIsAddTreeDialogOpen}
              onComplete={() => {
                setIsQuizRefreshing(true);
              }}
              latitude={event.location ? Number(event.location.latitude) : null}
              longitude={event.location ? Number(event.location.longitude) : null}
              eventId={event.id}
            ></IdentifyTreeFlowDialog>
          </Box>
          <Attendees
            users={status.attendees}
            onDelete={userId => {
              onDeleteCheckin(userId);
            }}
            onSetIsPrivate={updateIsPrivate}
            isPrivate={isPrivate}
            onRefresh={() => {
              getMembershipStatus();
            }}
            isShowAll={isShowAllAttendees}
            limit={attendeesDisplayLimit}
          ></Attendees>
          {status.checkInCount > status.attendees?.length && (isShowAllAttendees || status.attendees?.length <= attendeesDisplayLimit) && (
            <Typography variant='body2' ml={0} mt={-2} mb={3} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
              + {status.checkInCount - status.attendees?.length} other attendee
              {status.checkInCount - status.attendees?.length == 1 ? '' : 's'}
            </Typography>
          )}
          {!isShowAllAttendees && status.attendees?.length > attendeesDisplayLimit && (
            <Button
              sx={{ marginTop: -2, marginBottom: 3, textTransform: 'none', color: 'var(--secondary-text-color)' }}
              onClick={() => {
                setIsShowAllAttendees(true);
              }}
              variant='outlined'
            >
              Show All {status.checkInCount} Attendees
            </Button>
          )}
        </>
      )}
      {status?.isFound && (
        <>
          <hr style={{ width: '100%', marginTop: '10px', marginBottom: '30px' }} />

          <Link href='/signin'>
            <Button color='primary' variant='contained' sx={{ mb: 2 }}>
              {!hasActiveMembership ? 'Login to Renew Membership' : 'My Membership'}
            </Button>
          </Link>
          {hasActiveMembership && (
            <Typography variant='body2' sx={{ color: 'gray', textAlign: 'left', fontStyle: 'italic' }} mt={-2}>
              <p>Login with your email to:</p>
              <ul>
                <li>View membership perks</li>
                <li>Update profile and contact info</li>
                <li>Update credit card/donation amount</li>
                <li>Discover more ways to support TreeFolks</li>
              </ul>
            </Typography>
          )}
          {status.myCheckins?.length > 0 && (
            <>
              <Button
                color='secondary'
                variant='contained'
                onClick={() => {
                  setIsHistoryDialogOpen(true);
                }}
                sx={{ mb: 2 }}
              >
                View Check-in History
              </Button>
              <CheckinHistoryDialog
                checkins={status.myCheckins}
                isOpen={isHistoryDialogOpen}
                setIsOpen={setIsHistoryDialogOpen}
                onNavigate={() => {
                  setStatus(null);
                }}
              ></CheckinHistoryDialog>
            </>
          )}

          <Button onClick={reset} variant='outlined' color='secondary'>
            Add Another Check-in
          </Button>
        </>
      )}
      {status?.isFound === false && (activeTab != 1 || status.myCheckin?.user?.name) && (
        <>
          <hr style={{ width: '100%', marginTop: '10px', marginBottom: '20px' }} />
          <Typography variant='body2' component='p' mt={2} mb={2}>
            TreeFolks Young Professionals is the most fun way to support Central Texas&apos; urban forest.
          </Typography>
          <Typography variant='body2' component='p' mb={3}>
            Become a supporter with an annual donation to TreeFolks starting at $20/yr:
          </Typography>
          <Link href='/membership'>
            <Button color='primary' variant='contained' sx={{ mb: 2 }}>
              Become a Supporter
            </Button>
          </Link>

          <Button onClick={reset} variant='outlined' color='secondary'>
            {activeTab != 1 ? 'Add Another Check-in' : 'Try Another Search'}
          </Button>
        </>
      )}

      <TreeDisplayDialog tree={selectedTree} open={isDialogOpen} setOpen={setIsDialogOpen} eventId={event.id}></TreeDisplayDialog>

      {!status?.myCheckin && event.location && (
        <Box sx={{ display: 'none' }}>
          <MapMarkerDisplay
            isGoogle={true}
            markers={[{ latitude: Number(event.location.latitude), longitude: Number(event.location.longitude) }]}
            height='300px'
            mapStyle='SATELLITE'
            markerScale={0.5}
            isQuiz={true}
          ></MapMarkerDisplay>
        </Box>
      )}
      {status && !(status.isFound === false && activeTab == 1 && !status.myCheckin?.user?.name) && (
        <a
          href='https://www.instagram.com/treefolks_yp/'
          target='_instagram'
          rel='noreferrer'
          style={{ width: '100%', textDecoration: 'none' }}
        >
          <Button variant='outlined' sx={{ mt: 2, width: '100%' }}>
            Tag @treefolks_yp on Instagram
          </Button>
        </a>
      )}
    </>
  );
};
export default Checkin;

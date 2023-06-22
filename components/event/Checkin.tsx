import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import LoadingButton from '../LoadingButton';
import parsedGet from 'utils/api/parsed-get';
import { SubscriptionWithDetails } from '@prisma/client';
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
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { PartialEvent, PartialUser, PartialTree, Coordinate, PartialSpecies, PartialEventCheckIn, PartialSubscription } from 'interfaces';
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
import TreeIdQuiz from './TreeIdQuiz';
import BecomeAMemberDialog from './BecomeAMemberDialog';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
//import TreeIdLeaderPosition from './TreeIdLeaderPosition';
const MapMarkerDisplay = dynamic(() => import('components/maps/MapMarkerDisplay'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Skeleton variant='rectangular' sx={{ width: '100%' }} height={200} />,
});
const IdentifyTreeFlowDialog = dynamic(() => import('components/tree/IdentifyTreeFlowDialog'), {
  ssr: false,
});

type MembershipStatus = {
  subscription?: SubscriptionWithDetails;
  isFound?: boolean;
  email?: string;
  attendees?: PartialUser[];
  attendeesCount?: number;
  checkInCount?: number;
  myCheckin?: PartialEventCheckIn;
  myCheckins?: PartialEventCheckIn[];
};

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
  const [email, setEmail] = useLocalStorage('checkinEmail', '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [discoveredFrom, setDiscoveredFrom] = useState('');
  const [isEmailOptIn, setIsEmailOptIn] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTreeDialogOpen, setIsAddTreeDialogOpen] = useState(false);
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
        return { ...current, ...result };
      });
    }
  }, [status]);

  useEffect(() => {
    if (!email) return;
    setIsLoadingExistingUser(true);
    getMembershipStatus();
  }, [event?.id]);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const getMembershipStatus = async () => {
    setIsLoading(true);
    const result = (await parsedGet(
      `/api/events/${event.id}/checkin?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(
        firstName,
      )}&lastName=${encodeURIComponent(lastName)}&discoveredFrom=${encodeURIComponent(discoveredFrom)}&emailOptIn=${isEmailOptIn}`,
    )) as MembershipStatus;

    let status;
    if (result?.subscription) status = { ...result, isFound: true };
    else status = { ...result, isFound: false, email };
    setStatus(status);
    setIsPrivate(status.myCheckin?.isPrivate);

    setIsLoading(false);
  };

  const onDeleteCheckin = async (userId: number) => {
    await axios.delete(`/api/events/delete-checkin?userId=${userId}&eventId=${event.id}`);
    getMembershipStatus();
  };

  const setCheckinIsPrivate = async (isPrivate: boolean) => {
    if (!status.myCheckin?.userId) return;
    await axios.delete(`/api/events/update-checkin?userId=${status.myCheckin?.userId}&eventId=${event.id}&isPrivate=${isPrivate}`);
    getMembershipStatus();
  };

  const reset = async () => {
    setStatus(null);
    setEmail('');
    setFirstName('');
    setLastName('');
    setDiscoveredFrom('');
    setIsLoadingExistingUser(null);
  };

  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 366);

  const hasActiveMembership = status?.subscription?.lastPaymentDate > lastYear;

  const userName = status?.subscription?.userName?.split(' ')[0] || '';

  const updateIsPrivate = async () => {
    const newIsPrivate = !isPrivate;
    setIsPrivate(newIsPrivate);
    await axios.patch('/api/me/checkin/' + status.myCheckin.id, { isPrivate: newIsPrivate });
    getMembershipStatus();
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
            <Tabs value={activeTab} onChange={handleTabChange} variant='fullWidth' aria-label='basic tabs example'>
              <Tab label='New/Guest' className='transparent' />
              <Tab
                className='transparent'
                label={
                  <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                    <div>Member</div>
                  </Box>
                }
              />
            </Tabs>
          </Box>
          {activeTab == 0 && (
            <SplitRow gap={1}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                label='First Name'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                size='small'
                sx={{ mb: 3 }}
                required
              ></TextField>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                label='Last Name'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                size='small'
                sx={{ mb: 3 }}
                required
              ></TextField>
            </SplitRow>
          )}

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
          {activeTab == 0 && (
            <Box>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                label="How'd you learn about this event?"
                value={discoveredFrom}
                onChange={e => setDiscoveredFrom(e.target.value)}
                size='small'
                fullWidth
                sx={{ mb: 2 }}
              ></TextField>
              <FormGroup sx={{ marginBottom: 2 }}>
                <FormControlLabel
                  sx={{
                    '.MuiSvgIcon-root': { color: 'rgba(0, 0, 0, 0.4)' },
                    '& .MuiFormControlLabel-label': {
                      fontSize: '.75rem',
                      color: 'var(--secondary-text-color)',
                      fontStyle: 'italic',
                    },
                    marginRight: '0px',
                  }}
                  control={
                    <Checkbox
                      checked={isEmailOptIn}
                      onChange={e => {
                        setIsEmailOptIn(e.target.checked);
                      }}
                      color='default'
                      size='small'
                    />
                  }
                  label={`Learn about future events via our monthly email`}
                />
              </FormGroup>{' '}
            </Box>
          )}
          <LoadingButton
            isLoading={isLoading}
            disabled={!email || (activeTab == 0 && (!firstName || !lastName))}
            color='primary'
            onClick={getMembershipStatus}
            sx={{
              '& .Mui-disabled': { backgroundColor: 'rgba(72, 110, 98, .6)', display: 'none' },
            }}
            className='disabled-primary-button'
          >
            Check-in
          </LoadingButton>
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

      {status?.isFound === false && activeTab == 1 && (
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
      {status?.isFound === false && activeTab == 0 && (
        <>
          <Typography variant='body2' component='p' mb={2}>
            Thanks for joining for today&apos;s event. Grab a name tag (if available), meet a new friend, and test your tree knowledge
            below!
          </Typography>
          <Typography variant='body2' component='p' mb={3}>
            Don&apos;t forget to say &quot;Hey&quot; to a Core Team Member to learn more about TreeFolks.
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
              <Typography variant='body2' component='p' mb={2}>
                👥 &nbsp;Keep up with special events and opportunities in our
                <a href={process.env.BAND_URL || 'https://band.us/n/a4ae81veK4TfW'} target='_blank' rel='noreferrer' style={{}}>
                  <span style={{ marginLeft: '4px' }}>members only BAND App community</span>
                </a>
                .
              </Typography>
              {status.myCheckin?.user?.roles?.find(role => role.name === 'Core Team') && (
                <Typography variant='body2' component='p' mb={2}>
                  🗓 &nbsp;Help plan/organize in the
                  <a href={process.env.BAND_CORE_TEAM_URL || 'https://band.us/n/aaa18bv1q2U44'} target='_blank' rel='noreferrer' style={{}}>
                    <span style={{ marginLeft: '4px' }}>Core Team BAND</span>
                  </a>
                  .
                </Typography>
              )}
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
              <Typography variant='body2' component='p' mb={2}>
                Your most recent membership donation was {formatDateString(status.subscription.lastPaymentDate)}.
              </Typography>
            </>
          )}
        </>
      )}
      {status && !(status.isFound === false && activeTab == 1) && (
        <>
          <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={3} mt={1}>
            Tree ID Quiz
          </Typography>
          <Typography variant='body2' mt={-2} mb={2} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
            Click tree map markers below to learn about trees around us and test your knowledge
          </Typography>
          <Box sx={{ textAlign: 'right', mt: -1.5, mb: 0.2, fontSize: '80%' }}>
            <SplitRow>
              <a
                onClick={() => {
                  setIsQuizRefreshing(true);
                }}
                style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center' }}
              >
                <AutorenewIcon sx={{ fontSize: 'inherit' }} /> Reload
              </a>
              <a
                onClick={() => {
                  if (!hasActiveMembership) {
                    setIsMembershipDialogOpen(true);
                  } else setIsAddTreeDialogOpen(true);
                }}
                style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', gap: '3px', alignItems: 'center' }}
              >
                <LoupeIcon sx={{ fontSize: 'inherit' }}></LoupeIcon> Add a tree
              </a>
            </SplitRow>
            <BecomeAMemberDialog open={isMembershipDialogOpen} setOpen={setIsMembershipDialogOpen}></BecomeAMemberDialog>
          </Box>
          <TreeIdQuiz
            eventId={event.id}
            isRefreshing={isQuizRefreshing}
            defaultLatitude={Number(event.location?.latitude)}
            defaultLongitude={Number(event.location?.longitude)}
            setIsRefreshing={setIsQuizRefreshing}
            mapHeight='200px'
          ></TreeIdQuiz>
          <Box sx={{ textAlign: 'right', mt: 0.2, mb: 1, fontSize: '80%' }}>
            <Link href='/leaders'>
              <a
                style={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '3px',
                  alignItems: 'center',
                  justifyContent: 'end',
                }}
              >
                <LeaderboardIcon sx={{ fontSize: 'inherit' }}></LeaderboardIcon> Tree ID leaderboard
              </a>
            </Link>
          </Box>
          <IdentifyTreeFlowDialog
            open={isAddTreeDialogOpen}
            setOpen={setIsAddTreeDialogOpen}
            onComplete={() => {
              console.log('completed');
              setIsQuizRefreshing(true);
            }}
            latitude={event.location ? Number(event.location.latitude) : null}
            longitude={event.location ? Number(event.location.longitude) : null}
          ></IdentifyTreeFlowDialog>
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
      {status?.isFound === false && activeTab != 1 && (
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

      {!status && event.location && (
        <Box sx={{ display: 'none' }}>
          <MapMarkerDisplay
            markers={[{ latitude: Number(event.location.latitude), longitude: Number(event.location.longitude) }]}
            height='200px'
            mapStyle='SATELLITE'
            markerScale={0.5}
            isQuiz={true}
          ></MapMarkerDisplay>
        </Box>
      )}
      {status && !(status.isFound === false && activeTab == 1) && (
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

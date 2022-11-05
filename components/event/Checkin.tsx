/* TODO
- Members at the event

- Map of trees on Top if more than 1
- Tree Display: Image, Species, Species details?
    - Thanks?, comments? reactions?
- Checkins? 
*/
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
import { PartialEvent, PartialUser, PartialTree, Coordinate } from 'interfaces';
import Attendees from './Attendees';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';

type MembershipStatus = {
  subscription?: SubscriptionWithDetails;
  isFound?: boolean;
  email?: string;
  attendees?: PartialUser[];
  checkInCount?: number;
  trees: PartialTree[];
};

const formatDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'long', day: 'numeric' });
  console.log('attempting format Date?', date);
  if (date.getFullYear() != new Date().getFullYear()) dateStr += ', ' + date.getFullYear();
  return dateStr;
};

const Checkin = ({ event }: { event?: PartialEvent }) => {
  console.log('event', event);
  const [email, setEmail] = useLocalStorage('checkinEmail', '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [discoveredFrom, setDiscoveredFrom] = useState('');
  const [isEmailOptIn, setIsEmailOptIn] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<PartialTree>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MembershipStatus>(null);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!email) return;
    getMembershipStatus();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTreeClick = useCallback(
    (marker: Coordinate) => {
      const tree = status.trees.find(tree => Number(tree.latitude) == marker.latitude && Number(tree.longitude) == marker.longitude);
      console.log('tree', tree);
      setSelectedTree(tree);
      setIsDialogOpen(true);
    },
    [status],
  );

  const getMembershipStatus = async () => {
    setIsLoading(true);
    const result = (await parsedGet(
      `/api/events/${event.id}/checkin?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(
        firstName,
      )}&lastName=${encodeURIComponent(lastName)}&discoveredFrom=${encodeURIComponent(discoveredFrom)}`,
    )) as MembershipStatus;

    let status;
    if (result?.subscription) status = { ...result, isFound: true };
    else status = { ...result, isFound: false, email };
    console.log('status', status);
    setStatus(status);

    setIsLoading(false);
  };

  const reset = async () => {
    setStatus(null);
    setEmail('');
    setFirstName('');
    setLastName('');
    setDiscoveredFrom('');
  };

  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 366);

  const hasActiveMembership = status?.subscription?.lastPaymentDate > lastYear;

  const userName = status?.subscription?.userName?.split(' ')[0] || '';

  return (
    <>
      {status == null && (
        <>
          {false && (
            <Typography variant='h2' color='secondary' sx={{ textAlign: 'center' }}>
              Welcome!
            </Typography>
          )}
          <Typography variant='subtitle1' color='secondary' mb={-1}>
            {event?.name}
          </Typography>
          <Typography variant='subtitle2' sx={{ fontSize: '.8rem' }} color='gray' mb={2}>
            {formatDate(event?.startDate)}
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
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '.8rem' } }}
                  control={
                    <Checkbox
                      checked={isEmailOptIn}
                      onChange={e => {
                        setIsEmailOptIn(e.target.checked);
                      }}
                      color='secondary'
                    />
                  }
                  label={`Keep me in the loop with an occassional event announcement email/monthly newsletter`}
                />
              </FormGroup>{' '}
            </Box>
          )}
          <LoadingButton
            isLoading={isLoading}
            disabled={!email || (activeTab == 0 && (!firstName || !lastName))}
            color='primary'
            onClick={getMembershipStatus}
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

      {status?.isFound && (
        <>
          {hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                Thanks for being a member.
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Your most recent membership dues donation was {formatDate(status.subscription.lastPaymentDate)}.
              </Typography>
            </>
          )}
          {!hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                Thank you for your support.
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Unfortunately <b>your membership is no longer active</b>.
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Your most recent membership dues donation was {formatDate(status.subscription.lastPaymentDate)}.
              </Typography>
            </>
          )}

          {status && (
            <>
              <Attendees users={status.attendees}></Attendees>
              <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
                Learn Your Trees
              </Typography>
              <Box mb={3}>
                <MapMarkerDisplay
                  markers={status.trees.map(tree => {
                    return { latitude: Number(tree.latitude), longitude: Number(tree.longitude) };
                  })}
                  height='200px'
                  onClick={coordinate => {
                    handleTreeClick(coordinate);
                  }}
                  mapStyle='SATELLITE'
                  markerScale={0.5}
                ></MapMarkerDisplay>
              </Box>
            </>
          )}

          <Link href='/signin'>
            <Button color='primary' variant='contained' sx={{ mb: 2 }}>
              Login{!hasActiveMembership && ' to Renew Membership'}
            </Button>
          </Link>
          <Button onClick={reset} variant='outlined' color='secondary'>
            Add Another Check-in
          </Button>
        </>
      )}
      {status?.isFound === false && (
        <>
          {status && <Attendees users={status.attendees}></Attendees>}
          {activeTab == 1 && (
            <>
              <Typography variant='body2' component='p' mt={2} mb={3}>
                Membership status for <b>{status.email}</b> was not found.
              </Typography>
              <Button onClick={reset} variant='outlined' color='secondary' sx={{ mb: 2 }}>
                Try Another Search
              </Button>
            </>
          )}
          <Typography variant='body2' component='p' mt={2} mb={2}>
            TreeFolks Young Professionals is the most fun way to support Central Texas&apos; urban forest.
          </Typography>
          <Typography variant='body2' component='p' mb={3}>
            Join today by starting an annual donation to TreeFolks starting at $20:
          </Typography>
          <Link href='/membership'>
            <Button color='primary' variant='contained' sx={{ mb: 2 }}>
              Become a Member
            </Button>
          </Link>
          {activeTab != 1 && (
            <Button onClick={reset} variant='outlined' color='secondary'>
              Add Another Check-in
            </Button>
          )}
        </>
      )}
      <SafeHTMLDisplay html={event?.checkInDetails}></SafeHTMLDisplay>
      <TreeDisplayDialog tree={selectedTree} open={isDialogOpen} setOpen={setIsDialogOpen}></TreeDisplayDialog>
    </>
  );
  // Membership Status
  // Ice Breaker of the day/info about event (need a page to save this)
  // Who is here
  // Trees around you
};
export default Checkin;

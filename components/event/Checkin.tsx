/* TODO
- Members at the event

- Map of trees on Top if more than 1
- Tree Display: Image, Species, Species details?
    - Thanks?, comments? reactions?
- Checkins? 
*/
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
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
import { PartialEvent, PartialUser } from 'interfaces';

type MembershipStatus = {
  subscription?: SubscriptionWithDetails;
  isFound?: boolean;
  email?: string;
  attendees?: PartialUser[];
  checkInCount?: number;
};

const formatDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'long', day: 'numeric' });

  if (date.getFullYear() != new Date().getFullYear()) dateStr += ', ' + date.getFullYear();
  return dateStr;
};

const Checkin = ({ event }: { event?: PartialEvent }) => {
  console.log('event', event);
  const [email, setEmail] = useLocalStorage('checkInEmail', '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [discoveredFrom, setDiscoveredFrom] = useState('');
  const [isEmailOptIn, setIsEmailOptIn] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MembershipStatus>(null);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const getMembershipStatus = async () => {
    setIsLoading(true);
    const result = (await parsedGet(`/api/events/${event.id}/checkin?email=${encodeURIComponent(email)}`)) as MembershipStatus;

    if (result) setStatus({ ...result, isFound: true });
    else setStatus({ ...result, isFound: false, email });

    setIsLoading(false);
  };

  const reset = async () => {
    setStatus(null);
    setEmail('');
  };

  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 366);

  const hasActiveMembership = status?.subscription?.lastPaymentDate > lastYear;

  const userName = status?.subscription?.userName?.split(' ')[0] || '';

  return (
    <>
      {status == null && (
        <>
          <Typography variant='h2' sx={{ textAlign: 'center' }}>
            Welcome!
          </Typography>
          <Typography variant='subtitle2' mb={2}>
            Please check in to learn more about the trees around you and to help us stay organized.
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
                label='How did you find out about this event?'
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

      {status?.isFound && (
        <>
          {hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                Thanks for being a member{userName ? ' ' + userName : ''}!
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Your most recent membership dues donation was {formatDate(status.subscription.lastPaymentDate)}.
              </Typography>
            </>
          )}
          {!hasActiveMembership && (
            <>
              <Typography variant='body2' component='p' mb={2}>
                {userName ? `${userName}, thank you for your support!` : 'Thank you for your support!'}
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Unfortunately <b>your membership is no longer active</b>.
              </Typography>
              <Typography variant='body2' component='p' mb={2}>
                Your most recent membership dues donation was {formatDate(status.subscription.lastPaymentDate)}.
              </Typography>
            </>
          )}
          <Button onClick={reset} variant='outlined' color='secondary' sx={{ mb: 2 }}>
            Try Another Search
          </Button>
          <Link href='/signin'>
            <Button color='primary' variant='contained'>
              Login{!hasActiveMembership && ' to Renew Membership'}
            </Button>
          </Link>
        </>
      )}
      {status?.isFound === false && (
        <>
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
          <Link href='/membership'>
            <Button color='primary' variant='contained'>
              Become a Member
            </Button>
          </Link>
        </>
      )}
      <SafeHTMLDisplay html={event.checkInDetails}></SafeHTMLDisplay>
    </>
  );
  // Membership Status
  // Ice Breaker of the day/info about event (need a page to save this)
  // Who is here
  // Trees around you
};
export default Checkin;

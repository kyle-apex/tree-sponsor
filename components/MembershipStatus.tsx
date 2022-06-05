import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import LoadingButton from './LoadingButton';
import parsedGet from 'utils/api/parsed-get';
import { SubscriptionWithDetails } from '@prisma/client';
import Link from 'next/link';
import Button from '@mui/material/Button';

type MembershipStatus = {
  subscription: SubscriptionWithDetails;
  isFound: boolean;
  email?: string;
};

const formatDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'long', day: 'numeric' });

  if (date.getFullYear() != new Date().getFullYear()) dateStr += ', ' + date.getFullYear();
  return dateStr;
};

const MembershipStatus = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MembershipStatus>(null);

  const getMembershipStatus = async () => {
    setIsLoading(true);
    const result = (await parsedGet('/api/membership-status?email=' + email)) as SubscriptionWithDetails;

    if (result) setStatus({ subscription: result, isFound: true });
    else setStatus({ subscription: null, isFound: false, email });

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
          <Typography variant='body2' color='textSecondary' component='p' mb={3}>
            Enter your email address below to to verify your membership status:
          </Typography>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            label='Email Address'
            placeholder='me@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            size='small'
            sx={{ mb: 2 }}
          ></TextField>
          <LoadingButton isLoading={isLoading} disabled={!email} color='primary' onClick={getMembershipStatus}>
            Check Membership Status
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
          <Typography variant='body2' component='p' mt={2} mb={3}>
            Membership status for <b>{status.email}</b> was not found.
          </Typography>
          <Button onClick={reset} variant='outlined' color='secondary' sx={{ mb: 2 }}>
            Try Another Search
          </Button>
          <Link href='/membership'>
            <Button color='primary' variant='contained'>
              Become a Member
            </Button>
          </Link>
        </>
      )}
    </>
  );
};
export default MembershipStatus;

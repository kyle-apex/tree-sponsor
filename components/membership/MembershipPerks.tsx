import Typography from '@mui/material/Typography';
import RestrictSection from 'components/RestrictSection';
import Link from 'next/link';
import GoogleCalendar from './GoogleCalendar';

const MembershipPerks = ({ isMember }: { isMember?: boolean }) => {
  return (
    <>
      <Typography variant='h2' color='secondary'>
        Get engaged with TreeFolksYP
      </Typography>

      <ul>
        {isMember && (
          <>
            <li>
              <a href={process.env.BAND_URL || 'https://band.tfyp.org'} target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                <Typography color='primary'>Join our members only group on BAND for:</Typography>
              </a>
              <ul style={{ color: 'var(--secondary-text-color)' }}>
                <li>Members only updates and events</li>
                <li>Subscribing to our events calendar</li>
                <li>Sharing event photos</li>
                <li>Keep in touch with our weekly sharing posts</li>
              </ul>
            </li>
          </>
        )}
        <li>
          <a
            href={process.env.INSTAGRAM_URL || 'https://www.instagram.com/treefolks_yp/'}
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Follow @treefolks_yp on Instagram</Typography>
          </a>
        </li>
        <li>
          <Link href='/calendar'>
            <a style={{ textDecoration: 'none' }}>
              <Typography color='primary'>Subscribe to the event calendar</Typography>
            </a>
          </Link>
        </li>
      </ul>
      <Typography variant='h2' color='secondary'>
        Upcoming events
      </Typography>
      <GoogleCalendar></GoogleCalendar>
    </>
  );
};
export default MembershipPerks;

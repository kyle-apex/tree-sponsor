import Typography from '@mui/material/Typography';
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
              <a href={'https://band.us/n/a4ae81veK4TfW'} target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                <Typography color='primary'>Join our members only group on BAND for:</Typography>
              </a>
              <ul style={{ color: 'var(--secondary-text-color)' }}>
                <li>Members only updates and events</li>
                <li>Subscribing to our events calendar</li>
                <li>Member communications</li>
                <li>Sharing event photos</li>
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
      </ul>
      <Typography variant='h2' color='secondary'>
        Fundraise for TreeFolks passively
      </Typography>
      <ul>
        <li>
          <a href='https://smile.amazon.com/ch/74-2569827' target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
            <Typography color='primary'>Raise money for TreeFolks on Amazon purchases through Amazon Smile</Typography>
          </a>
        </li>
        <li>
          <a
            href='https://www.bing.com/?publ=BINGIP&crea=MY01IK&form=MY01IK&ocid=MY01IK&programname=GwBShare&cid=840-742569827'
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Support TreeFolks by setting your default search engine to Bing</Typography>
          </a>
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

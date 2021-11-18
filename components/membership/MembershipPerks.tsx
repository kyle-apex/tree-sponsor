import Typography from '@mui/material/Typography';
import GoogleCalendar from './GoogleCalendar';

const MembershipPerks = () => {
  return (
    <>
      <Typography variant='h2' color='secondary'>
        Stay in Touch
      </Typography>
      <ul>
        <li>
          <a
            href={
              process.env.NEXT_PUBLIC_SLACK_INVITE_URL ||
              'https://join.slack.com/t/treefolksyp/shared_invite/zt-y3mfodm8-8mix4P5~9OU9vPeqD7jrZA'
            }
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Join us on Slack</Typography>
          </a>
        </li>
        <li>
          <a
            href={process.env.FACEBOOK_GROUP_INVITE_URL || 'https://www.facebook.com/groups/2524568387782501'}
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Join the TreeFolks Young Professionals Facebook group</Typography>
          </a>
        </li>
      </ul>
      <Typography variant='h2' color='secondary'>
        Upcoming Events
      </Typography>
      <GoogleCalendar></GoogleCalendar>
    </>
  );
};
export default MembershipPerks;

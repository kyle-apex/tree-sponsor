import Typography from '@mui/material/Typography';
import GoogleCalendar from './GoogleCalendar';

const MembershipPerks = () => {
  return (
    <>
      <Typography variant='h2' color='secondary'>
        Stay in Touch With TreeFolksYP
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
            <Typography color='primary'>Join us on Slack where we organize and plan our events</Typography>
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
        <li>
          <a
            href={
              process.env.GOOGLE_CALENDAR_INVITE_URL ||
              'https://calendar.google.com/calendar/u/4?cid=dHJlZWZvbGtzLm9yZ19tNmpyZWVuZmk4MjNtZmM4dGQ0aHZhNGk1MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'
            }
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Subscribe to the Google Calendar</Typography>
          </a>
        </li>
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
          <a
            href={process.env.GOOGLE_GROUP_URL || 'https://groups.google.com/g/tfyp-event-invites'}
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Join the Membership Google Group to receive event calendar invites (no e-mails)</Typography>
          </a>
        </li>
      </ul>
      <Typography variant='h2' color='secondary'>
        Passive TreeFolks Fundraising
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
        Upcoming Events
      </Typography>
      <GoogleCalendar></GoogleCalendar>
    </>
  );
};
export default MembershipPerks;

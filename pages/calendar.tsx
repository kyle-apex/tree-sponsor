import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CopyIconButton from 'components/CopyIconButton';
import GoogleCalendar from 'components/membership/GoogleCalendar';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

const CalendarPage = () => {
  const importLink =
    process.env.BAND_CALENDAR_IMPORT_URL || 'webcal://api.band.us/ical?token=aAAxADM2NDVmMTEyOTQ1YjhkNDg0ZWVmNjlmMjlmNmU4ZjdmMmE5MGViZjY';
  const importCoreTeamLink =
    process.env.BAND_CALENDAR_CORE_TEAM_IMPORT_URL ||
    'webcal://api.band.us/ical?token=aAAxADI1MmNmMjIzZjE1ZmI5NTk2YTAzYzAwZjNjYjZiZWRjNmIyYjVlYmM';

  return (
    <Layout title='Calendar' header='Calendar'>
      <h1>Calendar</h1>
      <p>
        Import the calendar to your favorite applications using one of the options below. Be sure to join our BAND app groups to RSVP, keep
        up to date with, and/or organize carpools for events.{' '}
        <Link href='/account'>
          <a>(View BAND link in your account)</a>
        </Link>
      </p>
      <Typography variant='h2' color='secondary'>
        Subscribe
      </Typography>
      <Typography variant='body2'>Click the &quot;+ Google Calendar&quot; button at the bottom right of the calendar, or:</Typography>
      <ul>
        <li>
          <a
            href={
              process.env.BAND_CALENDAR_URL ||
              'https://calendar.google.com/calendar/u/0/render?cid=p98n056gtcfeuj437kjlm3ev516bpaop%40import.calendar.google.com'
            }
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Typography color='primary'>Subscribe to the event Google Calendar</Typography>
          </a>
        </li>
      </ul>
      <Typography variant='h2' color='secondary'>
        Import
      </Typography>
      <ul>
        <li>
          <Typography>Event calendar import link:</Typography>
          <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <CopyIconButton text={importLink}></CopyIconButton>
            <Typography variant='subtitle2' color='gray'>
              {importLink}
            </Typography>
          </Box>
        </li>
      </ul>
      <GoogleCalendar />
    </Layout>
  );
};

export default CalendarPage;

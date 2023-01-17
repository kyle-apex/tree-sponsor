import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import formatDateString from 'utils/formatDateString';
import { PartialEventCheckIn } from 'interfaces';
import Link from 'next/link';

const CheckinHistory = ({ checkins, handleClose }: { checkins: PartialEventCheckIn[]; handleClose?: () => void }) => {
  return (
    <>
      {checkins.map(checkin => {
        const event = checkin?.event;
        return (
          <Link href={`/e/${event?.path}/checkin`} key={event?.id}>
            <Box sx={{ cursor: 'pointer' }} onClick={handleClose}>
              <Typography variant='subtitle1' color='secondary' mb={-1}>
                {event?.name}
              </Typography>
              <Typography variant='subtitle2' sx={{ fontSize: '.8rem' }} color='gray' mb={2}>
                {formatDateString(event?.startDate)}
                {event?.location?.name && ' - ' + event.location.name}
              </Typography>
            </Box>
          </Link>
        );
      })}
    </>
  );
};
export default CheckinHistory;

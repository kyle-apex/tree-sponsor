import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import formatDateString from 'utils/formatDateString';
import { PartialEventCheckIn } from 'interfaces';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import EventNameDisplay from './EventNameDisplay';

const CheckinHistory = ({ checkins, handleClose }: { checkins: PartialEventCheckIn[]; handleClose?: () => void }) => {
  return (
    <>
      {checkins.map((checkin, idx) => {
        const event = checkin?.event;
        return (
          <>
            {idx > 0 && <Divider sx={{ marginBottom: 1 }}></Divider>}
            <Link href={`/e/${event?.path}/checkin`} key={event?.id}>
              <Box sx={{ cursor: 'pointer' }} onClick={handleClose}>
                <EventNameDisplay name={event?.name} />
                <Typography variant='subtitle2' sx={{ fontSize: '.8rem' }} color='gray' mb={1}>
                  {formatDateString(event?.startDate)}
                  {event?.location?.name && ' - ' + event.location.name}
                </Typography>
              </Box>
            </Link>
          </>
        );
      })}
    </>
  );
};
export default CheckinHistory;

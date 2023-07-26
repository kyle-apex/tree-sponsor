import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { PartialEvent } from 'interfaces';
import Link from 'next/link';
import formatDateString from 'utils/formatDateString';
import { useGet } from 'utils/hooks/use-get';
import EventNameDisplay from './EventNameDisplay';

const highlightSx = {
  marginLeft: '-20px',
  paddingLeft: '20px',
  marginRight: '-20px',
  backgroundColor: 'lightgray',
  marginBottom: '-1px',
  textDecoration: 'none',
};

const PriorEventList = ({ currentEventId, hasTreeQuizByDefault }: { currentEventId?: number; hasTreeQuizByDefault?: boolean }) => {
  const { data, isFetched, isFetching } = useGet<PartialEvent[]>(
    '/api/events',
    'priorEventsPublic',
    { isPastEvent: true },
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );
  const events = data ? [...data] : data;
  if (events?.indexOf(events?.find(e => e.id == currentEventId)) === 0) events.splice(0, 1);
  const urlSuffix = hasTreeQuizByDefault ? '#trees' : '';
  return (
    <>
      <Typography variant='subtitle1' color='secondary' sx={{ lineHeight: 'normal', textAlign: 'center', mb: 4, mt: 2 }}>
        Other Prior Events
      </Typography>
      {isFetching && (
        <Box>
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={20} />
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={20} />
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={20} />
        </Box>
      )}
      {!isFetching &&
        events?.map((event, idx) => {
          return (
            <Box key={event?.id} sx={event.id == currentEventId ? highlightSx : { cursor: 'pointer' }}>
              {idx > 0 && <Divider sx={{ mb: 1 }}></Divider>}
              <a href={`/e/${event?.path}/quiz${urlSuffix}`} style={{ textDecoration: 'none' }}>
                <Box>
                  <Typography variant='subtitle2' color='secondary' sx={{ lineHeight: 'normal' }}>
                    {event.name}
                  </Typography>
                  <Typography variant='subtitle2' sx={{ fontSize: '.8rem' }} color='gray' mb={1}>
                    {formatDateString(event?.startDate)}
                    {event?.location?.name && ' - ' + event.location.name}
                  </Typography>
                </Box>
              </a>
            </Box>
          );
        })}
    </>
  );
};
export default PriorEventList;

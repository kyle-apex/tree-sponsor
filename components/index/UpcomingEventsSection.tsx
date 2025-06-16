import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import { makeStyles } from '@mui/styles';
import { PartialEvent } from 'interfaces';
import parsedGet from 'utils/api/parsed-get';
import formatDateString from 'utils/formatDateString';
import formatTimeRange from 'utils/formatTimeRange';
import Link from 'next/link';
import { Divider, SectionHeader } from './StyledComponents';

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
  },
  eventCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  },
  eventMedia: {
    height: 200,
    backgroundSize: 'cover',
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  eventDate: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  eventDescription: {
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    textAlign: 'left',
  },
  cardActions: {
    marginTop: 'auto',
    padding: theme.spacing(2),
  },
  noEventsMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
}));

const UpcomingEventsSection: React.FC = () => {
  const classes = useStyles();
  const [upcomingEvents, setUpcomingEvents] = useState<PartialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      // Use the new forHomepage parameter to get filtered events from the server
      const events = await parsedGet<PartialEvent[]>('events?isPastEvent=false&forHomepage=true');
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUpcomingEvents();
  }, []);

  // If there are no upcoming events with description and pictureUrl, don't render the section
  if (!isLoading && upcomingEvents.length === 0) {
    return null;
  }

  return (
    <Container maxWidth='lg' id='upcoming-events-section' sx={{ textAlign: 'center' }}>
      <Divider />
      <Box pb={2}>
        <SectionHeader variant='h2' color='secondary' sx={{ mb: 5 }}>
          Upcoming Events
        </SectionHeader>

        <Grid container spacing={4} justifyContent='center'>
          {upcomingEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Link href={`/e/${event.path}/invite`} passHref>
                <Card className={classes.eventCard}>
                  <CardMedia
                    className={classes.eventMedia}
                    image={event.pictureUrl || '/index/social.jpg'} // Fallback image
                    title={event.name}
                  />
                  <CardContent>
                    <Typography variant='h6' className={classes.eventTitle}>
                      {event.name}
                    </Typography>
                    <Typography variant='body2' className={classes.eventDate}>
                      {event.startDate && (
                        <>
                          {formatDateString(event.startDate)}
                          {event.startDate && event.endDate && <> • {formatTimeRange(event.startDate, event.endDate)}</>}
                        </>
                      )}
                    </Typography>
                    <Typography
                      variant='body2'
                      className={classes.eventDescription}
                      dangerouslySetInnerHTML={{ __html: event.description || '' }}
                    />
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button size='small' color='primary' variant='outlined' fullWidth>
                      View and RSVP
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default UpcomingEventsSection;

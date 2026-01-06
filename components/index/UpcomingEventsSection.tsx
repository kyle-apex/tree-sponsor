import React, { useEffect, useState, useCallback } from 'react';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { markdownToHtml } from 'utils/markdown';

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
    '& p:first-child': {
      marginTop: '0 !important',
      marginBlockStart: '0 !important',
    },
  },
  cardActions: {
    marginTop: 'auto',
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  noEventsMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
}));

const UpcomingEventsSection: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [upcomingEvents, setUpcomingEvents] = useState<PartialEvent[]>([]);
  const [pastEvent, setPastEvent] = useState<PartialEvent | null>(null);
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

  const getPastEventWithQuizResponses = async () => {
    try {
      // Fetch the most recent past event with more than 0 speciesquizresponses
      const pastEvents = await parsedGet<PartialEvent[]>('events?isPastEvent=true&hasQuizResponses=true&limit=1');
      if (pastEvents && pastEvents.length > 0) {
        setPastEvent(pastEvents[0]);
      }
    } catch (error) {
      console.error('Error fetching past event with quiz responses:', error);
    }
  };

  useEffect(() => {
    getUpcomingEvents();
    getPastEventWithQuizResponses();
  }, []);

  // Only check for rendering after we've loaded both upcoming and past events

  // Render an event card with the given event and button text
  const renderEventCard = useCallback(
    (event: PartialEvent, buttonText: string, linkPath: string, isPastEvent = false) => {
      // For past events, use custom title, description, and image
      const title = isPastEvent ? 'Past Event Tree Identification' : event.name;
      const description = isPastEvent
        ? `Learn more about the trees from our ${event.name} at ${event.location?.name || 'the event location'}.`
        : event.description || '';
      const imageUrl = isPastEvent ? '/PriorEventTreeId.jpg' : event.pictureUrl || '/index/social.jpg';

      return (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <Link href={linkPath} passHref>
            <Card className={classes.eventCard}>
              <CardMedia className={classes.eventMedia} image={imageUrl} title={title} />
              <CardContent>
                <Typography variant='h6' className={classes.eventTitle}>
                  {title}
                </Typography>
                <Typography variant='body2' className={classes.eventDate}>
                  {isPastEvent
                    ? 'Event has completed'
                    : event.startDate && (
                        <>
                          {formatDateString(event.startDate)}
                          {event.startDate && event.endDate && <> • {formatTimeRange(event.startDate, event.endDate)}</>}
                        </>
                      )}
                </Typography>
                {isPastEvent ? (
                  <Typography variant='body2' className={classes.eventDescription}>
                    {description}
                  </Typography>
                ) : (
                  <Typography
                    variant='body2'
                    className={classes.eventDescription}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
                  />
                )}
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button size='small' color='primary' variant='outlined' fullWidth>
                  {buttonText}
                </Button>
              </CardActions>
            </Card>
          </Link>
        </Grid>
      );
    },
    [classes],
  );

  // If there are no upcoming events and no past event with quiz responses, don't render the section
  if (!isLoading && upcomingEvents.length === 0 && !pastEvent) {
    return null;
  }

  return (
    <Container maxWidth='lg' id='upcoming-events-section' sx={{ textAlign: 'center' }}>
      <Divider />
      <Box pb={2}>
        <SectionHeader variant='h2' color='secondary' sx={{ mb: 5 }}>
          Events
        </SectionHeader>

        <Grid container spacing={4} justifyContent='center'>
          {/* Show past event first on larger screens, or last on small screens */}
          {!isSmallScreen && pastEvent && renderEventCard(pastEvent, 'LEARN ABOUT TREES', `/e/${pastEvent.path}/quiz`, true)}

          {/* Show upcoming events */}
          {upcomingEvents.map(event => renderEventCard(event, 'View and RSVP', event.externalRSVPLink || `/e/${event.path}/invite`, false))}

          {/* Show past event last on small screens with a divider */}
          {isSmallScreen && pastEvent && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ margin: '32px auto' }} />
              </Grid>
              {renderEventCard(pastEvent, 'LEARN ABOUT TREES', `/e/${pastEvent.path}/quiz`, true)}
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default UpcomingEventsSection;

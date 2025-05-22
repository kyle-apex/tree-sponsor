import { MouseEvent, useState } from 'react';
import { trackClickEvent } from 'utils/analytics/track-click-event';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { PartialEvent, PartialEventRSVP } from 'interfaces';

interface InvitePostRSVPSectionProps {
  event: PartialEvent;
  currentRSVP?: PartialEventRSVP;
}

const InvitePostRSVPSection = ({ event, currentRSVP }: InvitePostRSVPSectionProps) => {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Calendar link generation functions
  const generateGoogleCalendarLink = (event: PartialEvent) => {
    // Ensure we have a valid startDate
    if (!event.startDate) {
      return '#';
    }

    // Create date objects from the event's startDate
    const startDate = new Date(event.startDate);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000); // 90 minutes in milliseconds

    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ format without dashes or colons)
    const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name,
    )}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(
      event.location.name,
    )}`;
  };

  const generateOutlookCalendarLink = (event: PartialEvent) => {
    // Ensure we have a valid startDate
    if (!event.startDate) {
      return '#';
    }

    // Create date objects from the event's startDate
    const startDate = new Date(event.startDate);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000); // 90 minutes in milliseconds

    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      event.name,
    )}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(
      event.description || '',
    )}&location=${encodeURIComponent(event.location.name)}`;
  };

  const generateYahooCalendarLink = (event: PartialEvent) => {
    // Ensure we have a valid startDate
    if (!event.startDate) {
      return '#';
    }

    // Create date objects from the event's startDate
    const startDate = new Date(event.startDate);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000); // 90 minutes in milliseconds

    // Format dates for Yahoo Calendar (YYYYMMDDTHHmmssZ format without dashes or colons)
    const yahooStartDate = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const yahooEndDate = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
      event.name,
    )}&st=${yahooStartDate}&et=${yahooEndDate}&desc=${encodeURIComponent(event.description || '')}&in_loc=${encodeURIComponent(
      event.location.name,
    )}`;
  };

  const generateICalendarLink = (event: PartialEvent) => {
    // Ensure we have a valid startDate
    if (!event.startDate) {
      return '#';
    }

    // Create date objects from the event's startDate
    const startDate = new Date(event.startDate);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000); // 90 minutes in milliseconds

    // Construct URL to the API endpoint with all necessary parameters
    const baseUrl = `${window.location.origin}/api/events/ical`;
    const params = new URLSearchParams({
      id: event.id?.toString() || '',
      name: event.name || '',
      description: event.description || '',
      location: event.location?.name || '',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Box
      sx={{
        mt: 3,
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: theme => `radial-gradient(circle at -50% -50%, #1b2b1c 0%, ${theme.palette.primary.main} 70%)`,
          padding: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'white' }}>
          Help us branch out!
        </Typography>
      </Box>
      <Typography variant='body2' p={2} pb={0}>
        It&quot;s easy to spread the word for an even bigger event supporting TreeFolks. Thanks!
      </Typography>

      {/* Content section */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Define common styles for all grid items */}
          {(() => {
            // Common styles for all Paper components
            const commonPaperStyles = {
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: (theme: Theme) => `${theme.palette.primary.main}10`,
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            };

            // Additional styles for link items
            const linkStyles = {
              ...commonPaperStyles,
              textDecoration: 'none',
              color: 'inherit',
            };

            // Common icon styles
            const iconStyles = { fontSize: 40, mb: 1 };

            // Common typography styles
            const typographyStyles = { fontWeight: 400, fontSize: '.8rem', color: 'text.secondary' };

            // Grid item definitions
            const gridItems = [
              {
                icon: (
                  <Typography color='primary' sx={{ ...iconStyles, fontSize: 32 }}>
                    🗓️
                  </Typography>
                ),
                text: 'Add to Calendar',
                onClick: (e: MouseEvent<HTMLElement>) => setCalendarAnchorEl(e.currentTarget),
                component: 'div' as React.ElementType | undefined,
                href: undefined as string | undefined,
              },
              {
                icon: (
                  <Typography color='primary' sx={{ ...iconStyles, fontSize: 32 }}>
                    🔗
                  </Typography>
                ),
                text: 'Copy Personal Invite Link',
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    let inviteUrl = window.location.origin + window.location.pathname;

                    // Add user ID as query parameter if the user is RSVP'd
                    if (currentRSVP?.userId) {
                      inviteUrl += `?u=${currentRSVP.userId}`;
                    }

                    navigator.clipboard.writeText(inviteUrl);
                    trackClickEvent('Copy Invite Link', inviteUrl);
                    setSnackbarOpen(true);
                  }
                },
                component: undefined,
                href: undefined,
              },
              {
                icon: (
                  <Typography color='primary' sx={{ ...iconStyles, fontSize: 32 }}>
                    👍
                  </Typography>
                ),
                text: 'Upvote on do512',
                onClick: undefined as ((e: MouseEvent<HTMLElement>) => void) | undefined,
                component: 'a' as React.ElementType,
                href: 'https://do512.tfyp.org',
              },
              {
                icon: (
                  <Typography color='primary' sx={{ ...iconStyles, fontSize: 32 }}>
                    🗣️
                  </Typography>
                ),
                text: 'RSVP on Meetup.com',
                onClick: undefined as ((e: MouseEvent<HTMLElement>) => void) | undefined,
                component: 'a' as React.ElementType,
                href: 'https://meetup.tfyp.org',
              },
            ];

            return gridItems.map((item, index) => (
              <Grid item xs={6} key={index}>
                {item.component === 'a' ? (
                  <Paper
                    elevation={2}
                    component={item.component}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={linkStyles as SxProps<Theme>}
                    onClick={(e: MouseEvent<HTMLElement>) => {
                      // Track the click event before navigating
                      trackClickEvent(item.text, item.href);

                      // Execute the original onClick if it exists
                      if (item.onClick) {
                        item.onClick(e);
                      }
                    }}
                  >
                    {item.icon}
                    <Typography variant='body1' align='center' sx={typographyStyles}>
                      {item.text}
                    </Typography>
                  </Paper>
                ) : (
                  <Paper elevation={2} sx={commonPaperStyles as SxProps<Theme>} onClick={item.onClick}>
                    {item.icon}
                    <Typography variant='body1' align='center' sx={typographyStyles}>
                      {item.text}
                    </Typography>
                  </Paper>
                )}
              </Grid>
            ));
          })()}
        </Grid>

        {/* Calendar dropdown menu */}
        <Menu anchorEl={calendarAnchorEl} open={Boolean(calendarAnchorEl)} onClose={() => setCalendarAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              const link = generateGoogleCalendarLink(event);
              trackClickEvent('Add to Google Calendar', link);
              window.open(link, '_blank');
              setCalendarAnchorEl(null);
            }}
          >
            Google Calendar
          </MenuItem>
          <MenuItem
            onClick={() => {
              const link = generateOutlookCalendarLink(event);
              trackClickEvent('Add to Outlook Calendar', link);
              window.open(link, '_blank');
              setCalendarAnchorEl(null);
            }}
          >
            Outlook Calendar
          </MenuItem>
          <MenuItem
            onClick={() => {
              const link = generateYahooCalendarLink(event);
              trackClickEvent('Add to Yahoo Calendar', link);
              window.open(link, '_blank');
              setCalendarAnchorEl(null);
            }}
          >
            Yahoo Calendar
          </MenuItem>
          <MenuItem
            onClick={() => {
              const link = generateICalendarLink(event);
              trackClickEvent('Add to iCalendar', link);
              window.open(link, '_blank');
              setCalendarAnchorEl(null);
            }}
          >
            iCalendar (.ics)
          </MenuItem>
        </Menu>
      </Box>

      {/* Snackbar for copy notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity='success' color='info' sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvitePostRSVPSection;

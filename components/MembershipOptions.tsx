import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import StarIcon from '@mui/icons-material/Star';
import React from 'react';

type ButtonVariant = 'text' | 'outlined' | 'contained';
const outlined: ButtonVariant = 'outlined';
const contained: ButtonVariant = 'contained';

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export const MembershipOptions = () => {
  const classes = useStyles();
  // https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/pricing/Pricing.js
  const tiers = [
    {
      title: 'Single Tree',
      subheader: '',
      price: '20',
      buttonText: 'Join Today',
      description: ['1 Tree Donated', 'Event Discounts', 'Exclusive Slack Access'],
      buttonVariant: outlined,
    },
    {
      title: 'Grove',
      subheader: '',
      price: '60',
      buttonText: 'Join Today',
      description: ['3 Trees Donated', 'Event Discounts', 'Exclusive Slack Access'],
      buttonVariant: contained,
    },
    {
      title: 'Forest',
      subheader: '',
      price: '100+',
      buttonText: 'Join Today',
      description: ['5+  Tree Donated', 'Event Discounts', 'Exclusive Slack Access'],
      buttonVariant: outlined,
    },
  ];
  // TODO! give preferred option the green background color
  return (
    <Grid container spacing={5} alignItems='flex-end'>
      {tiers.map(tier => (
        // Enterprise card is full width at sm breakpoint
        <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
          <Card>
            <CardHeader
              title={tier.title}
              subheader={tier.subheader}
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{ align: 'center' }}
              action={tier.title === 'Pro' ? <StarIcon /> : null}
              className={classes.cardHeader}
            />
            <CardContent>
              <div className={classes.cardPricing}>
                <Typography component='h2' variant='h3' color='textPrimary'>
                  ${tier.price}
                </Typography>
                <Typography variant='h6' color='textSecondary'>
                  /yr
                </Typography>
              </div>
              <ul>
                {tier.description.map(line => (
                  <Typography component='li' variant='subtitle1' align='center' key={line}>
                    {line}
                  </Typography>
                ))}
              </ul>
            </CardContent>
            <CardActions>
              <Button fullWidth variant={tier.buttonVariant} color='primary'>
                {tier.buttonText}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

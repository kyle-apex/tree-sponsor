import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TFYPAboutSection from './TFYPAboutSection';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  headlineSubTitle: {
    marginBottom: theme.spacing(4),
  },
}));

const IntroSection: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{ marginTop: '0px !important', background: 'radial-gradient(circle at -50% -50%, #1b2b1c 0%, #486e62 70%)' }}
        p={5}
        className='index detail-section'
      >
        <Typography variant='h2'>What is TreeFolks Young Professionals?</Typography>
        <Typography variant='subtitle1' className={classes.headlineSubTitle}>
          TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission of
          TreeFolks: planting, caring for, and giving people free trees to plant!
        </Typography>
      </Box>
      <Box mt={-15} mb={8} className='index'>
        <TFYPAboutSection />
      </Box>
    </Container>
  );
};

export default IntroSection;

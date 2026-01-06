import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TFYPAboutSection from './TFYPAboutSection';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  memberButton: {
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#1b2b1c',
      color: '#ffffff',
    },
  },
}));

const IntroSection: React.FC = () => {
  const classes = useStyles();

  const scrollToMembershipSection = () => {
    // Find the membership section and scroll to it
    const membershipSection = document.getElementById('membership-section');
    if (membershipSection) {
      membershipSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: try to find the section by its component structure
      const sections = document.querySelectorAll('section');
      // The membership section should be the third main section
      if (sections.length >= 3) {
        sections[2].scrollIntoView({ behavior: 'smooth' });
      } else {
        // Last resort: scroll down a fixed amount
        window.scrollTo({
          top: 1200,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{ marginTop: '0px !important', background: 'radial-gradient(circle at -50% -50%, #1b2b1c 0%, #486e62 70%)' }}
        p={5}
        className='index detail-section'
      >
        <Typography variant='h2'>What is TreeFolks Young Professionals?</Typography>
        <Typography variant='subtitle1' sx={{ marginBottom: theme => theme.spacing(2), fontSize: '1.2rem' }}>
          TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission of
          TreeFolks: planting, caring for, and giving people free trees to plant!
        </Typography>
        <Button
          variant='outlined'
          sx={{ px: 3, borderColor: '#ffffff', color: '#ffffff', marginBottom: theme => theme.spacing(2) }}
          size='medium'
          className={classes.memberButton}
          onClick={scrollToMembershipSection}
        >
          Become a Supporter
        </Button>
      </Box>
      <Box mt={-15} mb={8} className='index'>
        <TFYPAboutSection />
      </Box>
    </Container>
  );
};

export default IntroSection;

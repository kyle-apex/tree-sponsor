import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SignupForm from '../membership/SignupForm';
import { CurveTop, CurveBottom } from './icons';
import { CurveTopContainer, CurveBottomContainer } from './StyledComponents';

interface MembershipSectionProps {
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
}

const MembershipSection: React.FC<MembershipSectionProps> = ({ stripePriceIdLow, stripePriceIdMedium, stripePriceIdHigh }) => {
  return (
    <>
      <CurveTopContainer>
        <CurveTop />
      </CurveTopContainer>

      <div id='membership-section' className='wide-container index'>
        <Container maxWidth='sm'>
          <Typography color='white' variant='h1' sx={{ fontSize: '2rem' }}>
            Become a Supporting Member
          </Typography>
          <Typography variant='body2' mb={-1}>
            Support the Central Texas urban forest with an annual membership. Please select a TreeFolks donation level below:
          </Typography>
        </Container>
      </div>

      <CurveBottomContainer>
        <CurveBottom />
      </CurveBottomContainer>

      <Box>
        <SignupForm stripePriceIdHigh={stripePriceIdHigh} stripePriceIdLow={stripePriceIdLow} stripePriceIdMedium={stripePriceIdMedium} />
      </Box>
    </>
  );
};

export default MembershipSection;

import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { TitleSection } from 'interfaces';
import {
  SectionHeader,
  SectionOverline,
  SectionSubtitle,
  BenefitCard,
  IconCircle,
  BenefitTitle,
  BenefitDescription,
} from './StyledComponents';
import { PollutionIcon, FloodingIcon } from './icons';
import ShadeImage from './icons/ShadeImage';
import AtmosphereImage from './icons/AtmosphereImage';
import ActivitiesImage from './icons/ActivitiesImage';
import AnimalsImage from './icons/AnimalsImage';

// Icon component with consistent styling
const BenefitIcon: React.FC<{ title: string }> = ({ title }) => {
  const iconStyle = {
    width: '60px',
    height: '60px',
    position: 'relative',
    zIndex: 2,
  };

  const renderIcon = () => {
    switch (title) {
      case 'Pollution':
        return <PollutionIcon />;
      case 'Flood Prevention':
        return <FloodingIcon />;
      case 'Homes':
        return <AnimalsImage />;
      case 'Shade':
        return <ShadeImage />;
      case 'Atmosphere':
        return <AtmosphereImage />;
      case 'Activities':
        return <ActivitiesImage />;
      default:
        return null;
    }
  };

  return <Box sx={iconStyle}>{renderIcon()}</Box>;
};

// Benefit card component
const BenefitCardComponent: React.FC<{ benefit: TitleSection }> = ({ benefit }) => {
  return (
    <BenefitCard>
      <IconCircle>
        <BenefitIcon title={benefit.title} />
      </IconCircle>
      <BenefitTitle variant='h6' color='primary'>
        {benefit.title}
      </BenefitTitle>
      <BenefitDescription variant='body2'>{benefit.description}</BenefitDescription>
    </BenefitCard>
  );
};

// Tree benefits section component
const TreeBenefitsSection: React.FC<{ benefits: TitleSection[] }> = ({ benefits }) => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <SectionOverline variant='overline'>BENEFITS OF TREES</SectionOverline>
        <SectionHeader variant='h2' color='secondary'>
          Why Support the Urban Forest?
        </SectionHeader>
        <SectionSubtitle variant='subtitle1' color='text.secondary'>
          Your annual membership helps grow and maintain our urban forest, creating a healthier and more sustainable community for everyone.
        </SectionSubtitle>
      </Box>
      <Grid container spacing={3} mb={6}>
        {benefits.map((benefit, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4}>
            <BenefitCardComponent benefit={benefit} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TreeBenefitsSection;

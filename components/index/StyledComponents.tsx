import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Section header with decorative underline
export const SectionHeader = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#486e62',
  },
}));

// Section overline text (small heading above main heading)
export const SectionOverline = styled(Typography)(({ theme }) => ({
  color: '#486e62',
  fontWeight: 600,
  letterSpacing: 1.5,
  fontSize: '1rem',
  display: 'block',
  marginBottom: theme.spacing(1),
}));

// Section subtitle text
export const SectionSubtitle = styled(Typography)(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(5),
}));

// Benefit card container
export const BenefitCard = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3.5),
  borderRadius: 24, // Fixed value instead of multiplying theme.borderRadius
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(145deg, #ffffff, #f5f9f7)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(72, 110, 98, 0.15)',
    background: 'linear-gradient(145deg, #f5f9f7, #ffffff)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle at top right, rgba(72, 110, 98, 0.05) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 0,
  },
}));

// Icon circle container
export const IconCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2.5),
  borderRadius: '50%',
  width: 90,
  height: 90,
  background: 'linear-gradient(135deg, rgba(72, 110, 98, 0.18) 0%, rgba(72, 110, 98, 0.08) 100%)',
  border: '2px solid rgba(72, 110, 98, 0.25)',
  margin: '0 auto',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(72, 110, 98, 0.25) 0%, rgba(72, 110, 98, 0.15) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(72, 110, 98, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 1,
  },
}));

// Benefit title with decorative underline
export const BenefitTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '3px',
    borderRadius: '2px',
    backgroundColor: 'rgba(72, 110, 98, 0.3)',
  },
}));

// Benefit description text
export const BenefitDescription = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  lineHeight: 1.7,
  marginTop: theme.spacing(1.5),
  position: 'relative',
  zIndex: 1,
}));

// Decorative divider
export const Divider = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '3px',
  backgroundColor: '#486e62',
  margin: '56px auto 24px auto',
}));

// Curve container styles
export const CurveTopContainer = styled(Box)({
  height: '150px',
  width: '100%',
  marginTop: '-80px',
  overflow: 'hidden',
});

export const CurveBottomContainer = styled(Box)({
  height: '360px',
  marginBottom: '-360px',
  width: '100%',
  overflow: 'hidden',
  transform: 'scaleY(-1) scaleX(-1)',
  marginTop: '-1px',
});

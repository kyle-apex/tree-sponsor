import React, { useEffect, useRef } from 'react';
import { Box, Grid, LinearProgress, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

interface FundraisingGoalDisplayProps {
  currentAmount: number;
  goalAmount: number;
  addedAmount: number;
  hideAddedAmount?: boolean;
}

// Custom styled LinearProgress to allow for multiple colors in one progress bar
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: '5px 0 0 5px', // Only round the left side
  },
}));

// Custom component for the added amount indicator
const AddedAmountIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 20,
  backgroundColor: theme.palette.primary.main, // Orange color that complements the primary color
  borderRadius: '0 5px 5px 0',
  backgroundImage:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
  backgroundSize: '40px 40px',
  animation: 'progress-bar-stripes 2s linear infinite',
  transition: 'left 0.5s ease-out, width 0.5s ease-out', // Add transition for smooth animation
  '@keyframes progress-bar-stripes': {
    from: { backgroundPosition: '40px 0' },
    to: { backgroundPosition: '0 0' },
  },
}));

const FundraisingGoalDisplay: React.FC<FundraisingGoalDisplayProps> = ({
  currentAmount,
  goalAmount,
  addedAmount,
  hideAddedAmount = false,
}) => {
  const theme = useTheme();
  const componentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Effect to scroll to this component when donate=true is in the URL
  useEffect(() => {
    if (router.query.donate === 'true' && componentRef.current) {
      // Function to scroll to this component
      const scrollToComponent = () => {
        if (componentRef.current) {
          // Element found, scroll to it
          componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Clear the interval once we've scrolled to the element
          clearInterval(checkInterval);
        }
      };

      // Check immediately and then set up an interval to keep checking
      // (since the component might not be fully rendered immediately)
      scrollToComponent();
      const checkInterval = setInterval(scrollToComponent, 500);

      // Clean up the interval when the component unmounts
      return () => clearInterval(checkInterval);
    }
  }, [router.query]);

  // Calculate percentages for progress bars
  const currentPercentage = (currentAmount / goalAmount) * 100;
  const addedPercentage = (addedAmount / goalAmount) * 100;
  const totalPercentage = Math.min(100, currentPercentage + addedPercentage);

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2 }} className='FundraisingGoalDisplay' ref={componentRef}>
      <Grid container spacing={2} alignItems='center'>
        {/* Current Amount */}
        <Grid item xs={2}>
          <Typography variant='body1' fontWeight='bold'>
            {formatCurrency(currentAmount)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            raised
          </Typography>
        </Grid>

        {/* Progress Bar */}
        <Grid item xs={8}>
          <Box sx={{ position: 'relative' }}>
            {/* Base progress bar showing current amount */}
            <StyledLinearProgress
              variant='determinate'
              value={currentPercentage}
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: hideAddedAmount ? theme.palette.primary.main : '#b3b3b3',
                },
              }}
            />

            {/* Added amount overlay */}
            {addedAmount > 0 && !hideAddedAmount && (
              <>
                <AddedAmountIndicator
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${currentPercentage}%`,
                    width: `${addedPercentage}%`,
                    maxWidth: `${100 - currentPercentage}%`,
                  }}
                />

                {/* Added amount label */}
                {false && (
                  <Typography
                    variant='body1'
                    sx={{
                      position: 'absolute',
                      top: -24,
                      // If total would exceed 100%, position near right edge but within bounds
                      left: totalPercentage >= 100 ? '90%' : `${currentPercentage + addedPercentage / 2}%`,
                      transform: 'translateX(-50%)',
                      color: '#f39c12',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      transition: 'left 0.5s ease-out', // Add transition for smooth animation
                      maxWidth: '100%', // Ensure text doesn't overflow container
                    }}
                  >
                    +{formatCurrency(addedAmount)}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Grid>

        {/* Goal Amount */}
        <Grid item xs={2} sx={{ textAlign: 'right' }}>
          <Typography variant='body1' fontWeight='bold'>
            {formatCurrency(goalAmount)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            goal
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FundraisingGoalDisplay;

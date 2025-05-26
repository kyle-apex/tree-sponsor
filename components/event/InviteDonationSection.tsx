import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FundraisingGoalDisplay from 'components/admin/FundraisingGoalDisplay';
import FundraisingButtonSelector from 'components/admin/FundraisingButtonSelector';
import DonateButton from 'components/DonateButton';
import { PartialEvent, PartialEventRSVP } from 'interfaces';

interface InviteDonationSectionProps {
  event: PartialEvent;
  currentRSVP?: PartialEventRSVP;
  currentAmount?: number;
  goalAmount?: number;
  returnUrl?: string;
}

const InviteDonationSection: React.FC<InviteDonationSectionProps> = ({
  event,
  currentRSVP,
  currentAmount = 0,
  goalAmount = 1000,
  returnUrl,
}) => {
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [addedAmount, setAddedAmount] = useState<number>(0);

  // Predefined donation amounts
  const donationAmounts = [10, 25, 50, 100];

  // Handle donation amount selection
  const handleAmountChange = (amount: number) => {
    setDonationAmount(amount);
    setAddedAmount(amount); // Preview the donation in the goal display
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
          Support TreeFolks
        </Typography>
      </Box>

      {/* Description */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant='body1' gutterBottom>
          Your donation helps us plant more trees and create a greener community!
        </Typography>

        {/* Fundraising Goal Display */}
        <FundraisingGoalDisplay currentAmount={currentAmount} goalAmount={goalAmount} addedAmount={addedAmount} />

        {/* Donation Amount Selector */}
        <FundraisingButtonSelector amounts={donationAmounts} amount={donationAmount} setAmount={handleAmountChange} />

        {/* Donate Button */}
        <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <DonateButton
            amount={donationAmount}
            metadata={{
              eventId: event.id?.toString() || '',
              eventName: event.name || '',
              userId: currentRSVP?.userId?.toString() || '',
            }}
            returnUrl={returnUrl}
            label={`Donate $${donationAmount}`}
            size='large'
            fullWidth={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InviteDonationSection;

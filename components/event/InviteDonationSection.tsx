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
  // Log props for debugging
  console.log('InviteDonationSection props:', { currentAmount, goalAmount, addedAmount: 25 });
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [addedAmount, setAddedAmount] = useState<number>(25); // Initialize to same value as donationAmount

  // Predefined donation amounts
  const donationAmounts = [10, 25, 50, 100];

  // Handle donation amount selection
  const handleAmountChange = (amount: number) => {
    setDonationAmount(amount);
    setAddedAmount(amount); // Preview the donation in the goal display
  };

  return (
    <Box>
      {/* Description */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant='body2' gutterBottom>
          Help us reach our {goalAmount.toLocaleString()} fundraising goal with donation to TreeFolks. Thanks!
        </Typography>

        {/* Fundraising Goal Display */}
        <FundraisingGoalDisplay currentAmount={currentAmount} goalAmount={goalAmount} addedAmount={addedAmount} />

        {/* Donation Amount Selector */}
        <FundraisingButtonSelector amounts={donationAmounts} amount={donationAmount} setAmount={handleAmountChange} />

        {/* Donate Button */}
        <Box sx={{ mt: 1, mb: 2, display: 'flex', justifyContent: 'center' }}>
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
            color='primary'
            variant='outlined'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InviteDonationSection;

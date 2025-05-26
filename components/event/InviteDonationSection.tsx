import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FundraisingGoalDisplay from 'components/admin/FundraisingGoalDisplay';
import FundraisingButtonSelector from 'components/admin/FundraisingButtonSelector';
import DonateButton from 'components/DonateButton';
import UserAvatarsRowWithLabel from 'components/UserAvatarsRowWithLabel';
import { PartialEvent, PartialEventRSVP, PartialUser } from 'interfaces';
import UserBubbles from './UserBubbles';

interface InviteDonationSectionProps {
  event: PartialEvent;
  currentRSVP?: PartialEventRSVP;
  currentAmount?: number;
  goalAmount?: number;
  returnUrl?: string;
  donors?: PartialUser[];
}

const InviteDonationSection: React.FC<InviteDonationSectionProps> = ({
  event,
  currentRSVP,
  currentAmount = 0,
  goalAmount = 1000,
  returnUrl,
  donors = [],
}) => {
  // Log props for debugging
  console.log('InviteDonationSection props:', { currentAmount, goalAmount, addedAmount: 25 });
  const [donationAmount, setDonationAmount] = useState<number>(10);
  const [addedAmount, setAddedAmount] = useState<number>(10); // Initialize to same value as donationAmount

  // Predefined donation amounts
  const donationAmounts = [5, 10, 20, 50];

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
          Help us reach our ${goalAmount.toLocaleString()} pre-event fundraising goal with donation to TreeFolks. Thanks!
        </Typography>

        {/* Fundraising Goal Display */}
        <FundraisingGoalDisplay currentAmount={currentAmount} goalAmount={goalAmount} addedAmount={addedAmount} />

        {/* Display donors if there are any */}
        {donors.length > 0 && (
          <Box flexDirection='row' alignItems='center' sx={{ display: 'flex', gap: '5px', mt: -1, mb: -1 }}>
            <UserBubbles users={donors} maxLength={3} size={28} />

            <Typography color='gray' variant='body2'>
              {donors[0]?.name && donors[1]?.name
                ? (() => {
                    const othersCount = donors.length - 2;
                    if (othersCount > 0) {
                      return `${donors[0].name}, ${donors[1].name}, and ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`;
                    }
                    return `${donors[0].name}, ${donors[1].name}`;
                  })()
                : donors[0]?.name
                ? donors[0].name
                : 'No attendees yet'}
            </Typography>
          </Box>
        )}

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

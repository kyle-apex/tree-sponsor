import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import StatisticIconDisplay from './StatisticIconDisplay';
import UpdateIcon from '@mui/icons-material/Update';
import DateField from 'components/form/DateField';
import { getYearDateRange } from 'utils/get-year-date-range';
import { useDebouncedCallback } from 'use-debounce';
import FundraisingGoalDisplay from './FundraisingGoalDisplay';
import FundraisingButtonSelector from './FundraisingButtonSelector';
import { Box, Typography, Paper } from '@mui/material';
import DonateButton from 'components/DonateButton';

type Stats = {
  activeDonations: number;
  upcomingMemberDonations: number;
  activeMembers: number;
  currentYearMemberDonations: number;
  currentYearDonations: number;
  currentActiveDonations: number;
  currentActiveMembers: number;
};

const FundraisingStatsWithGoal = ({
  year,
  refreshWhenFalse,
  goalAmount = 10000,
}: {
  year?: number;
  refreshWhenFalse?: boolean;
  goalAmount?: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats>(null);

  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(10);

  const currentYear = year || new Date().getFullYear();

  const debouncedGetStats = useDebouncedCallback(() => {
    getStats();
  }, 10);

  const getStats = async () => {
    setIsLoading(true);

    let endDateFilter = endDate;

    if (startDate && !endDate && !(startDate.getMonth() == 0 && startDate.getDate() == 1)) {
      endDateFilter = new Date();
      endDateFilter.setDate(endDateFilter.getDate() + 1);
    }

    const dateFilter = startDate && endDateFilter ? `&startDate=${startDate.toISOString()}&endDate=${endDateFilter.toISOString()}` : '';

    setStats(await parsedGet(`/api/donations/stats?year=${year}${dateFilter}`));
    setIsLoading(false);
  };

  useEffect(() => {
    setIsCustomDate(false);
    const result = getYearDateRange(year, true);
    setStartDate(result.startDate);
    if (year == new Date().getFullYear()) setEndDate(null);
    else setEndDate(result.endDate);
    if (!refreshWhenFalse) debouncedGetStats();
  }, [refreshWhenFalse, year]);

  useEffect(() => {
    debouncedGetStats();
  }, [startDate, endDate]);

  // Calculate current total and remaining amount
  const currentTotal = stats ? stats.currentYearDonations + stats.currentYearMemberDonations : 0;
  const upcomingDonations = stats ? stats.upcomingMemberDonations : 0;
  const remainingToGoal = Math.max(0, goalAmount - currentTotal - upcomingDonations);

  return (
    <>
      {/* New Fundraising Goal Display Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant='h6' gutterBottom>
          {currentYear} Fundraising Progress - ${goalAmount.toLocaleString()} Goal
        </Typography>

        <FundraisingGoalDisplay currentAmount={10} goalAmount={100} addedAmount={selectedAmount} />

        <FundraisingButtonSelector amounts={[5, 10, 20, 50]} amount={selectedAmount} setAmount={setSelectedAmount} />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <DonateButton
            amount={selectedAmount}
            label={`Donate $${selectedAmount}`}
            metadata={{
              source: 'fundraising_goal',
              year: currentYear.toString(),
              campaign: `${currentYear} Fundraising Goal`,
            }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2' color='text.secondary'>
            Current donations: ${currentTotal.toLocaleString()}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Upcoming donations: ${upcomingDonations.toLocaleString()}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Remaining to goal: ${remainingToGoal.toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      {/* Original Stats Content */}
      <Grid container spacing={4} mb={3}>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color='secondary'
            label='Current Member Subscription Donations'
            count={stats?.currentActiveDonations}
            isCurrency={true}
            isLoading={isLoading}
          ></StatisticIconDisplay>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color='secondary'
            label='Current Average Subscription Amount'
            count={stats?.currentActiveDonations / Math.max(1, stats?.currentActiveMembers)}
            isCurrency={true}
            isLoading={isLoading}
          ></StatisticIconDisplay>
        </Grid>
      </Grid>
      <hr style={{ marginBottom: '26px' }} />
      <Grid container spacing={4}>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <DateField
            value={startDate}
            setValue={date => {
              setIsCustomDate(true);
              setStartDate(date);
            }}
            label='Start Date'
          ></DateField>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <DateField
            value={endDate}
            setValue={date => {
              setIsCustomDate(true);
              setEndDate(date);
            }}
            label='End Date'
          ></DateField>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color='secondary'
            label={`Member Donations${isCustomDate ? '' : ' in ' + currentYear}`}
            count={stats?.currentYearMemberDonations}
            isCurrency={true}
            isLoading={isLoading}
          ></StatisticIconDisplay>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color='secondary'
            label={`${isCustomDate ? '' : currentYear + ' '}Event Donations`}
            count={stats?.currentYearDonations}
            isCurrency={true}
            isLoading={isLoading}
          ></StatisticIconDisplay>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            label={`Total ${isCustomDate ? '' : currentYear + ' '}Fundraising`}
            count={stats?.currentYearDonations + stats?.currentYearMemberDonations}
            isCurrency={true}
            isLoading={isLoading}
            color='primary'
          ></StatisticIconDisplay>
        </Grid>
        {startDate?.getMonth() == 0 && startDate?.getDate() == 1 && (
          <>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                label={endDate > new Date() ? 'Scheduled by ' + endDate.toDateString() : 'Scheduled by the end of ' + currentYear}
                count={stats?.upcomingMemberDonations}
                isCurrency={true}
                isLoading={isLoading}
                icon={<UpdateIcon fontSize='medium'></UpdateIcon>}
                color='primary'
              ></StatisticIconDisplay>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                label={`Current Fundraising + Scheduled Donations`}
                count={stats?.currentYearDonations + stats?.currentYearMemberDonations + stats?.upcomingMemberDonations}
                isCurrency={true}
                isLoading={isLoading}
                icon={<UpdateIcon fontSize='medium'></UpdateIcon>}
                color='primary'
              ></StatisticIconDisplay>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                label={`Unaccounted for donations for $${goalAmount.toLocaleString()} goal`}
                count={goalAmount - (stats?.currentYearDonations + stats?.currentYearMemberDonations + stats?.upcomingMemberDonations)}
                isCurrency={true}
                isLoading={isLoading}
                icon={<UpdateIcon fontSize='medium'></UpdateIcon>}
                color='primary'
              ></StatisticIconDisplay>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default FundraisingStatsWithGoal;

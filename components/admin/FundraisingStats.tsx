import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import StatisticIconDisplay from './StatisticIconDisplay';
import UpdateIcon from '@mui/icons-material/Update';
import DateField from 'components/form/DateField';
import { getYearDateRange } from 'utils/get-year-date-range';
import { useDebouncedCallback } from 'use-debounce';

type Stats = {
  activeDonations: number;
  upcomingMemberDonations: number;
  activeMembers: number;
  currentYearMemberDonations: number;
  currentYearDonations: number;
};

const FundraisingStats = ({ year, refreshWhenFalse }: { year?: number; refreshWhenFalse?: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats>(null);

  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);
  const [isCustomDate, setIsCustomDate] = useState(false);

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

  return (
    <>
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
        {currentYear == new Date().getFullYear() && (
          <>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                color='secondary'
                label='Active Member Subscription Donations'
                count={stats?.activeDonations}
                isCurrency={true}
                isLoading={isLoading}
              ></StatisticIconDisplay>
            </Grid>
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
          </>
        )}
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
            label='Average Subscription Amount'
            count={stats?.activeDonations / Math.max(1, stats?.activeMembers)}
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
      </Grid>
    </>
  );
};
export default FundraisingStats;

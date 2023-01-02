import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import StatisticIconDisplay from './StatisticIconDisplay';
import UpdateIcon from '@mui/icons-material/Update';

type Stats = {
  activeDonations: number;
  activeMembers: number;
  currentYearMemberDonations: number;
  currentYearDonations: number;
};

const FundraisingStats = ({ year, refreshWhenFalse }: { year?: number; refreshWhenFalse?: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats>(null);

  const currentYear = year || new Date().getFullYear();

  const getStats = async () => {
    setIsLoading(true);
    setStats(await parsedGet(`/api/donations/stats?year=${year}`));
    setIsLoading(false);
  };

  useEffect(() => {
    if (!refreshWhenFalse) getStats();
  }, [refreshWhenFalse, year]);

  return (
    <>
      <Grid container spacing={4}>
        {currentYear == new Date().getFullYear() && (
          <>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                color='secondary'
                label='Active Member Subscription Donations'
                count={stats?.activeDonations}
                isCurrency={true}
                isLoading={isLoading}
                description='Last 365 Days'
              ></StatisticIconDisplay>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <StatisticIconDisplay
                label={'Scheduled by the end of ' + currentYear}
                count={stats?.activeDonations - stats?.currentYearMemberDonations}
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
            label={'Member Donations in ' + currentYear}
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
            label={`${currentYear} Event Donations`}
            count={stats?.currentYearDonations}
            isCurrency={true}
            isLoading={isLoading}
          ></StatisticIconDisplay>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            label={`Total ${currentYear} Fundraising`}
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

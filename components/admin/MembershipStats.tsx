import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import GroupsIcon from '@mui/icons-material/Groups';
import MembershipAttritionChart from './MembershipAttritionChart';
import MembershipChart from './MembershipChart';
import StatisticIconDisplay from './StatisticIconDisplay';
import getYearStartDate from 'utils/get-year-start-date';

const lastMonth = new Date();
lastMonth.setDate(lastMonth.getDate() - 30);

type Stats = {
  active: number;
  newActive: number;
  newInactive: number;
  percentageByYear: { percentage: number; bestPercentage: number }[];
};

const MembershipStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(lastMonth);
  const [stats, setStats] = useState<Stats>(null);

  const getStats = async () => {
    setIsLoading(true);
    setStats(await parsedGet('/api/members/stats'));
    setIsLoading(false);
  };

  useEffect(() => {
    getStats();
  }, [startDate]);

  const endOfYearTime = getYearStartDate(new Date().getFullYear() + 1).getTime();

  const increasePerDay = ((stats?.newActive || 0) - (stats?.newInactive || 0)) / 30;
  const daysLeftInYear = (endOfYearTime - new Date().getTime()) / 1000 / 60 / 60 / 24;
  const projectedMembers = stats ? stats.active + Math.ceil(daysLeftInYear * increasePerDay) : 0;

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            icon={<GroupsIcon fontSize='medium' />}
            color='secondary'
            label='Active Members'
            count={stats?.active}
            isLoading={isLoading}
            description={'End of Year Pace: ' + projectedMembers}
          ></StatisticIconDisplay>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color={stats?.newActive ? 'primary' : 'secondary'}
            label='New Members'
            count={stats?.newActive}
            showUpIcon={!!stats?.newActive}
            isLoading={!stats || isLoading}
            description='Last 30 Days'
          ></StatisticIconDisplay>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <StatisticIconDisplay
            color={stats?.newInactive ? 'red' : 'secondary'}
            label='Newly Inactive'
            count={stats?.newInactive}
            showDownIcon={!!stats?.newInactive}
            isLoading={!stats || isLoading}
            description='Last 30 Days'
          ></StatisticIconDisplay>
        </Grid>
      </Grid>
      <hr style={{ marginTop: '26px', marginBottom: '26px' }} />
      <Box sx={{ maxHeight: '400px' }}>
        <MembershipChart></MembershipChart>
      </Box>
      <hr style={{ marginTop: '26px', marginBottom: '26px' }} />
      <Box sx={{ maxHeight: '300px' }}>
        <MembershipAttritionChart chartData={stats?.percentageByYear}></MembershipAttritionChart>
      </Box>
    </>
  );
};
export default MembershipStats;

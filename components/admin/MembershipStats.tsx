import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import GroupsIcon from '@mui/icons-material/Groups';
import MembershipAttritionChart from './MembershipAttritionChart';
import MembershipChart from './MembershipChart';
import StatisticIconDisplay from './StatisticIconDisplay';

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

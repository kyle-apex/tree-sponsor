import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const lastMonth = new Date();
lastMonth.setDate(lastMonth.getDate() - 30);

type Stats = {
  active: number;
  newActive: number;
  newInactive: number;
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
    <Grid container spacing={4}>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Typography variant='h3' color='secondary'>
          {!isLoading && <GroupsIcon fontSize='large' />} {(!stats || isLoading) && <CircularProgress size={20}></CircularProgress>}
          {stats && stats.active}
        </Typography>
        <Typography variant='subtitle1'>Active Members</Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Typography variant='h3' color={stats?.newActive ? 'primary' : 'secondary'}>
          {!!stats?.newActive && <ArrowDropUpIcon fontSize='large' />}
          {(!stats || isLoading) && <CircularProgress size={20}></CircularProgress>}
          {stats && stats.newActive}
        </Typography>
        <Typography variant='subtitle1'>New Members</Typography>
        <Typography variant='body2' color='textSecondary'>
          Last 30 Days
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Typography variant='h3' color={stats?.newInactive ? 'red' : 'secondary'}>
          {!!stats?.newInactive && <ArrowDropDownIcon fontSize='large' />}
          {(!stats || isLoading) && <CircularProgress size={20}></CircularProgress>}
          {stats && stats.newInactive}
        </Typography>
        <Typography variant='subtitle1'>Newly Inactive</Typography>
        <Typography variant='body2' color='textSecondary'>
          Last 30 Days
        </Typography>
      </Grid>
    </Grid>
  );
};
export default MembershipStats;

import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, TextField, Button } from '@mui/material';
import AdminLayout from 'components/layout/AdminLayout';
import FundraisingStatsWithGoal from 'components/admin/FundraisingStatsWithGoal';

const FundraisingDashboardWithGoal = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [goalAmount, setGoalAmount] = useState<number>(10000);
  const [customGoal, setCustomGoal] = useState<string>('10000');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedYear(new Date().getFullYear() - newValue);
  };

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGoal(event.target.value);
  };

  const updateGoal = () => {
    const newGoal = parseInt(customGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoalAmount(newGoal);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth='lg'>
        <Typography variant='h1' gutterBottom>
          Fundraising Dashboard
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <TextField
            label='Fundraising Goal'
            type='number'
            value={customGoal}
            onChange={handleGoalChange}
            sx={{ width: 200, mr: 2 }}
            InputProps={{
              startAdornment: (
                <Box component='span' sx={{ mr: 1 }}>
                  $
                </Box>
              ),
            }}
          />
          <Button variant='contained' color='primary' onClick={updateGoal}>
            Update Goal
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label='year tabs'>
            <Tab label={`${new Date().getFullYear()} (Current)`} />
            <Tab label={new Date().getFullYear() - 1} />
            <Tab label={new Date().getFullYear() - 2} />
          </Tabs>
        </Box>

        <FundraisingStatsWithGoal year={selectedYear} goalAmount={goalAmount} />
      </Container>
    </AdminLayout>
  );
};

export default FundraisingDashboardWithGoal;

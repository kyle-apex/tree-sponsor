import { Card, CardContent, Container, Grid, TextField, Tab, Tabs, TableCell, TableRow, Table, Box, Chip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CheckoutButton from 'components/CheckoutButton';
import React, { useState } from 'react';
import Layout from 'components/layout/Layout';
import { Check, CheckCircle, Nature, Room } from '@mui/icons-material';
//import TreeDetail from 'components/sponsor/TreeDetails';

const useStyles = makeStyles(theme => ({
  tabs: { width: '100%' },
  tab: {},
}));

const TabLabel = ({ title, pricing, subtitle }: { title: string; pricing: string; subtitle: string }) => (
  <>
    <Box sx={{ fontSize: '.8rem', fontWeight: 'normal' }}>{title}</Box>
    <Box sx={{ fontSize: '1.4rem', margin: '8px 0px', textTransform: 'none' }}>{pricing}</Box>
    <Box sx={{ fontSize: '.7rem', fontWeight: 'normal' }}>{subtitle}</Box>
  </>
);

const SignupPage = () => {
  const classes = useStyles();
  const [activeMembership, setActiveMembership] = useState('Grove');

  const handleChange = (_event: any, newValue: string) => {
    setActiveMembership(newValue);
  };

  return (
    <Layout>
      <Container maxWidth='sm'>
        <Tabs
          sx={{
            width: '100%',
            marginTop: theme => theme.spacing(2),
            '& .MuiTabs-flexContainer': { width: '100%', flexContainer: { width: '100%' } },
            '& .Mui-selected': {
              borderColor: theme => theme.palette.primary.main,
              borderWidth: '3px',
              padding: '10px 14px',
              backgroundColor: '#ecefee',
            },
            '& button': {
              flex: '1 1 auto',
              border: 'solid lightgray 1px',
            },
          }}
          value={activeMembership}
          onChange={handleChange}
        >
          <Tab label={<TabLabel title='Single' pricing='$20/yr' subtitle='Most Affordable'></TabLabel>} value='Single' />
          <Tab label={<TabLabel title='Grove' pricing='$60/yr' subtitle='Most Popular'></TabLabel>} value='Grove' />
          <Tab label={<TabLabel title='Forest' pricing='$100/yr' subtitle='Most Trees!'></TabLabel>} value='Forest' />
        </Tabs>
        <Table>
          <TableRow>
            <TableCell>Tree Sponsorships</TableCell>
            <TableCell>
              <Chip
                label='3'
                sx={{
                  '& img': { marginLeft: '10px !important', marginRight: '-4px !important', height: '18px' },
                  '& .MuiChip-label': { fontWeight: 600 },
                }}
                icon={<img src='/tree-small.svg' />}
                color='primary'
              ></Chip>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TreeFolks Donation</TableCell>
            <TableCell>
              <div>$60/yr</div>
              <Box sx={{ fontSize: '.75em', color: 'gray' }}>(Thanks!)</Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tee Shirt</TableCell>
            <TableCell>
              <CheckCircle color='primary'></CheckCircle>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TreeFolksYP Membership</TableCell>
            <TableCell>
              <CheckCircle color='primary'></CheckCircle>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Slack & Facebook Group Access</TableCell>
            <TableCell>
              <CheckCircle color='primary'></CheckCircle>
            </TableCell>
          </TableRow>
        </Table>
      </Container>
    </Layout>
  );
};
export default SignupPage;

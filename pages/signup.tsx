import {
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Tab,
  Tabs,
  TableCell,
  TableRow,
  Table,
  Box,
  Chip,
  Button,
  TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CheckoutButton from 'components/CheckoutButton';
import React, { useState } from 'react';
import Layout from 'components/layout/Layout';
import { Check, CheckCircle, HighlightOff, Nature, Room } from '@mui/icons-material';
//import TreeDetail from 'components/sponsor/TreeDetails';

const TabLabel = ({ title, pricing, subtitle }: { title: string; pricing: string; subtitle: string }) => (
  <>
    <Box sx={{ fontSize: '.8rem', fontWeight: 'normal' }}>{title}</Box>
    <Box sx={{ fontSize: '1.4rem', margin: '8px 0px', textTransform: 'none' }}>{pricing}</Box>
    <Box sx={{ fontSize: '.7rem', fontWeight: 'normal' }}>{subtitle}</Box>
  </>
);

const SignupPage = ({
  stripePriceIdLow,
  stripePriceIdMedium,
  stripePriceIdHigh,
}: {
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
}) => {
  const memberships = [
    { trees: 1, price: 20, hasShirt: false, stripePriceId: stripePriceIdLow },
    { trees: 3, price: 60, hasShirt: true, stripePriceId: stripePriceIdMedium },
    { trees: 5, price: 100, hasShirt: true, stripePriceId: stripePriceIdHigh },
  ];
  const [activeMembershipIndex, setActiveMembershipIndex] = useState(1);

  const handleChange = (_event: any, newValue: number) => {
    setActiveMembershipIndex(newValue);
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
          value={activeMembershipIndex}
          onChange={handleChange}
        >
          <Tab label={<TabLabel title='Single' pricing='$20/yr' subtitle='Most Affordable'></TabLabel>} value={0} />
          <Tab label={<TabLabel title='Grove' pricing='$60/yr' subtitle='Most Popular'></TabLabel>} value={1} />
          <Tab label={<TabLabel title='Forest' pricing='$100/yr' subtitle='Most Trees!'></TabLabel>} value={2} />
        </Tabs>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Tree Sponsorships</TableCell>
              <TableCell>
                <Chip
                  label={memberships[activeMembershipIndex].trees}
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
                <div>${memberships[activeMembershipIndex].price}/yr</div>
                <Box sx={{ fontSize: '.75em', color: 'gray' }}>(Thanks!)</Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tee Shirt</TableCell>
              <TableCell>
                {memberships[activeMembershipIndex].hasShirt ? (
                  <CheckCircle color='primary'></CheckCircle>
                ) : (
                  <HighlightOff color='secondary'></HighlightOff>
                )}
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
          </TableBody>
        </Table>
        <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
          <CheckoutButton price={memberships[activeMembershipIndex].stripePriceId}></CheckoutButton>
        </Box>
      </Container>
    </Layout>
  );
};
export default SignupPage;

export async function getServerSideProps() {
  return {
    props: {
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW,
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM,
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH,
    },
  };
}

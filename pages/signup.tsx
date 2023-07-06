import Checkbox from '@mui/material/Checkbox';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tabs from '@mui/material/Tabs';
import TableRow from '@mui/material/TableRow';
import CheckoutButton from 'components/CheckoutButton';
import React, { useState } from 'react';
import Layout from 'components/layout/Layout';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from 'next/link';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/client';
import { Subscriptions } from '@mui/icons-material';
import { Session } from 'interfaces';

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
  const [session] = useSession();
  const mySession = session as Session;
  const memberships = [
    { trees: 1, price: 20, hasShirt: false, stripePriceId: stripePriceIdLow },
    { trees: 3, price: 60, hasShirt: true, stripePriceId: stripePriceIdMedium },
    { trees: 5, price: 100, hasShirt: true, stripePriceId: stripePriceIdHigh },
  ];
  const [activeMembershipIndex, setActiveMembershipIndex] = useState(1);

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveMembershipIndex(newValue);
  };

  const [isMembership, setIsMembership] = useState(true);

  return (
    <Layout title='Sign Up'>
      <Container maxWidth='sm'>
        {mySession?.user?.subscriptions?.length > 0 && (
          <Box mb={2}>
            <Link href={session ? '/account' : '/signin'}>
              <a style={{ textDecoration: 'none' }}>
                <Box flexDirection='row' sx={{ display: 'flex' }} gap={0.4}>
                  <Typography color='primary'>Thanks for being a member! Click here to manage your account</Typography>
                  <ChevronRight color='primary' />
                </Box>
              </a>
            </Link>
          </Box>
        )}
        <Typography color='secondary' variant='h1' sx={{ fontSize: '2rem' }}>
          Become a Member
        </Typography>
        <p>
          Support the Central Texas urban forest by becoming a TreeFolks Young Professionals (TreeFolksYP) member. Please select an annual
          TreeFolks donation level below:
        </p>
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
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Event Discounts</TableCell>
              <TableCell>
                {isMembership ? (
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>BAND App Community Access</TableCell>
              <TableCell>
                {isMembership ? (
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tokens of Appre-tree-ation</TableCell>
              <TableCell>
                <Chip
                  label={memberships[activeMembershipIndex].trees}
                  sx={{
                    '& img': { marginLeft: '10px !important', marginRight: '-4px !important', height: '18px' },
                    '& .MuiChip-label': { fontWeight: 600 },
                  }}
                  icon={<img src='/tree-small.svg' alt='tree icon' />}
                  color='primary'
                ></Chip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ marginTop: 2 }}>
          <FormGroup sx={{ marginBottom: 2, marginLeft: 2, marginRight: 2 }}>
            <FormControlLabel
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '.8rem' } }}
              control={
                <Checkbox
                  checked={isMembership}
                  onChange={e => {
                    setIsMembership(e.target.checked);
                  }}
                  color='secondary'
                />
              }
              label={`I would like to receive email updates for events and volunteer opportunities`}
            />
          </FormGroup>
          <CheckoutButton
            metadata={{ 'Email Subscribe': isMembership ? 'Yes' : 'No' }}
            price={memberships[activeMembershipIndex].stripePriceId}
          ></CheckoutButton>
        </Box>
      </Container>
    </Layout>
  );
};
export default SignupPage;

export async function getServerSideProps() {
  return {
    props: {
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW || '',
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM || '',
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH || '',
    },
  };
}

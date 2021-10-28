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
import Typography from '@mui/material/Typography';

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

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveMembershipIndex(newValue);
  };

  const [isMembership, setIsMembership] = useState(true);

  return (
    <Layout>
      <Container maxWidth='sm'>
        <Typography color='secondary' variant='h1' sx={{ fontSize: '2rem' }}>
          Sponsor a Tree / Start a Membership
        </Typography>
        <p>
          Whether you want to sponsor trees, join TreeFolks Young Professionals (TreeFolksYP), or both, you are in the right place. Please
          select a TreeFolks donation level below:
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
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TreeFolksYP Membership</TableCell>
              <TableCell>
                {isMembership ? (
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Slack & Facebook Group Access</TableCell>
              <TableCell>
                {isMembership ? (
                  <CheckCircleIcon color='primary'></CheckCircleIcon>
                ) : (
                  <HighlightOffIcon color='secondary'></HighlightOffIcon>
                )}
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
              label='In addition to my tree sponsorship, I would like to be a part of TreeFolks Young Professionals and receive email updates for events and volunteer opportunities'
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
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW,
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM,
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH,
    },
  };
}

import Checkbox from '@mui/material/Checkbox';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tabs from '@mui/material/Tabs';
import TableRow from '@mui/material/TableRow';
import CheckoutButton from 'components/CheckoutButton';
import React, { useRef, useState } from 'react';
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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Session } from 'interfaces';
import { CurveBottom } from 'components/index/icons/CurveBottom';
import { CurveTop } from 'components/index/icons/CurveTop';

const TabLabel = ({ title, pricing, subtitle }: { title: string; pricing: string; subtitle: string }) => (
  <>
    <Box sx={{ fontSize: '.8rem', fontWeight: 'normal' }}>{title}</Box>
    <Box sx={{ fontSize: '1.4rem', margin: '8px 0px', textTransform: 'none' }}>{pricing}</Box>
    <Box sx={{ fontSize: '.7rem', fontWeight: 'normal' }}>{subtitle}</Box>
  </>
);

const SignupForm = ({
  stripePriceIdLow,
  stripePriceIdMedium,
  stripePriceIdHigh,
  foundFromSource,
  cancelRedirectPath,
}: {
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
  foundFromSource?: string;
  cancelRedirectPath?: string;
}) => {
  const [session] = useSession();

  const mySession = session as Session;
  const [foundFrom, setFoundFrom] = useState(foundFromSource);

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
    <Container maxWidth='sm'>
      <Tabs
        sx={{
          width: '100%',
          overflow: 'visible',
          marginTop: theme => theme.spacing(2),
          '& .MuiTabs-fixed': { overflow: 'visible !important' },
          '& .MuiTabs-flexContainer': { width: '100%', flexContainer: { width: '100%' } },
          '& .Mui-selected': {
            borderColor: theme => theme.palette.primary.main,
            borderWidth: '3px',
            padding: '10px 14px',
            backgroundColor: '#ecefee',
            boxShadow: '-1px 1px 5px 0px white',
            marginTop: '-2px',
            marginBottom: '-1px',
          },
          '& button': {
            flex: '1 1 auto',
            border: 'solid lightgray 1px',
            backgroundColor: '#fff',
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
            <TableCell>Tax Deductible TreeFolks Donation</TableCell>
            <TableCell>
              <div>${memberships[activeMembershipIndex].price}/yr</div>
              <Box sx={{ fontSize: '.75em', color: 'gray' }}>(Thanks!)</Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div style={{ color: 'gray', marginLeft: '-10px', fontWeight: 'lighter', fontSize: '.75rem', marginTop: '-20px' }}>
                Membership Bonuses:
              </div>
              <div>TreeFolksYP Tee Shirt</div>
            </TableCell>
            <TableCell>
              {memberships[activeMembershipIndex].hasShirt ? (
                <CheckCircleIcon color='primary'></CheckCircleIcon>
              ) : (
                <HighlightOffIcon color='secondary'></HighlightOffIcon>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TreeFolks & TreeFolksYP Event Discounts</TableCell>
            <TableCell>
              <CheckCircleIcon color='primary'></CheckCircleIcon>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>BAND App Community Access</TableCell>
            <TableCell>
              <CheckCircleIcon color='primary'></CheckCircleIcon>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ marginTop: 2 }}>
        <TextField
          value={foundFrom}
          onChange={e => {
            setFoundFrom(e.target.value);
          }}
          label='How did you find out about TreeFolksYP?'
          fullWidth={true}
          size='small'
          autoComplete='off'
          disabled={!!foundFromSource}
        ></TextField>
      </Box>
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
            label={`Keep me informed of TreeFolksYP events and volunteer opportunities via monthly email updates`}
          />
        </FormGroup>
        <CheckoutButton
          metadata={{ 'Email Subscribe': isMembership ? 'Yes' : 'No', 'Found From': foundFrom }}
          price={memberships[activeMembershipIndex].stripePriceId}
          isForMembership={true}
          label='Continue to Donation'
          cancelRedirectPath={cancelRedirectPath}
        ></CheckoutButton>
      </Box>
    </Container>
  );
};
export default SignupForm;

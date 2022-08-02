import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DateField from 'components/form/DateField';
import { PartialDonation } from 'interfaces';
import { useRef, useState } from 'react';
import { Prisma } from '@prisma/client';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

const AddDonationForm = ({ onAdd }: { onAdd: (donation: PartialDonation) => void }) => {
  const [donation, setDonation] = useState<PartialDonation>({ label: '', amount: new Prisma.Decimal(0), source: '', date: new Date() }); //useRef<PartialDonation>({});

  //const newDonation = newDonationRef.current;

  return (
    <Box flexDirection='column' sx={{ display: 'flex' }} gap={theme => theme.spacing(3)}>
      <TextField
        label='Label'
        size='small'
        value={donation.label}
        onChange={e => {
          setDonation(d => {
            return { ...d, label: e.target.value };
          });
          //newDonation.label = e.target.value;
        }}
      ></TextField>
      <TextField
        label='Source'
        size='small'
        value={donation?.source}
        onChange={e => {
          setDonation(d => {
            return { ...d, source: e.target.value };
          });
          //newDonation.source = e.target.value;
        }}
      ></TextField>
      <TextField
        label='Amount'
        type='number'
        size='small'
        value={donation?.amount.toNumber() || ''}
        onChange={e => {
          setDonation(d => {
            return { ...d, amount: new Prisma.Decimal(e.target.value) };
          });
          //newDonation.amount = new Prisma.Decimal(e.target.value);
        }}
      ></TextField>
      <DateField
        value={donation.date}
        setValue={date => {
          setDonation(d => {
            return { ...d, date };
          });
        }}
        label='Date'
      ></DateField>
      <Button
        disabled={!(donation?.date && donation?.label && donation?.amount)}
        onClick={() => {
          onAdd(donation);
          setDonation({ label: '', amount: new Prisma.Decimal(0), source: '', date: new Date() });
        }}
        color='primary'
        variant='contained'
        startIcon={<AddIcon />}
      >
        Add Donation
      </Button>
    </Box>
  );
};
export default AddDonationForm;

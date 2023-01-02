import Box from '@mui/material/Box';
import { Donation } from '@prisma/client';
import AddDonationForm from 'components/admin/AddDonationForm';
import DonationTable from 'components/admin/DonationTable';
import FundraisingStats from 'components/admin/FundraisingStats';

import AdminLayout from 'components/layout/AdminLayout';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';
import { PartialDonation } from 'interfaces';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import { Prisma } from '@prisma/client';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const addDonationToDatabase = async (donation: PartialDonation) => {
  const result = await axios.post('/api/donations', donation);
  return result.data;
};

async function handleDelete(id: number) {
  await axios.delete('/api/donations/' + id);
}

const years: number[] = [];
for (let year = 2019; year <= new Date().getFullYear(); year++) years.push(year);

const FundraisingDashboardPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: donations, isFetching } = useGet<Donation[]>('/api/donations', 'donations', { year });
  const { remove, isLoading: isRemoveLoading } = useRemoveFromQuery(['donations', { year }], handleDelete);
  const { add, isLoading: isAddLoading } = useAddToQuery<PartialDonation>(['donations', { year }], addDonationToDatabase);

  const displayDonations = donations?.map(donation => {
    return { ...donation, amount: typeof donation.amount == 'string' ? new Prisma.Decimal(donation.amount) : donation.amount };
  });

  return (
    <AdminLayout title='Fundraising Dashboard' header='Fundraising Dashboard'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
        <Tabs className='account-tabs' value={year} onChange={(_event, newTab) => setYear(newTab)} variant='fullWidth'>
          {years.map(year => {
            return <Tab key={year} label={year} value={year} />;
          })}
        </Tabs>
      </Box>
      <FundraisingStats year={year} refreshWhenFalse={isAddLoading || isRemoveLoading}></FundraisingStats>
      <Box mt={5} mb={5}>
        <DonationTable donations={displayDonations} isFetching={isFetching} onDelete={remove}></DonationTable>
      </Box>
      <h2>Log a Donation</h2>
      <AddDonationForm onAdd={add}></AddDonationForm>
    </AdminLayout>
  );
};
export default FundraisingDashboardPage;

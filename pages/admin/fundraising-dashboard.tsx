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

const addDonationToDatabase = async (donation: PartialDonation) => {
  const result = await axios.post('/api/donations', donation);
  return result.data;
};

async function handleDelete(id: number) {
  await axios.delete('/api/donations/' + id);
}

const FundraisingDashboardPage = () => {
  const { data: donations, isFetching } = useGet<Donation[]>('/api/donations', 'donations');
  const { remove } = useRemoveFromQuery('donations', handleDelete);
  const { add } = useAddToQuery<PartialDonation>('donations', addDonationToDatabase);

  const displayDonations = donations?.map(donation => {
    return { ...donation, amount: typeof donation.amount == 'string' ? new Prisma.Decimal(donation.amount) : donation.amount };
  });

  return (
    <AdminLayout title='Fundraising Dashboard' header='Fundraising Dashboard'>
      <FundraisingStats></FundraisingStats>
      <Box mt={5} mb={5}>
        <DonationTable donations={displayDonations} isFetching={isFetching} onDelete={remove}></DonationTable>
      </Box>
      <h2>Log a Donation</h2>
      <AddDonationForm onAdd={add}></AddDonationForm>
    </AdminLayout>
  );
};
export default FundraisingDashboardPage;

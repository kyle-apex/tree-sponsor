import Button from '@mui/material/Button';
import AddEvent from 'components/event/AddEvent';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import { PartialEvent } from 'interfaces';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';

const AddEventPage = () => {
  const onAdd = (newEvent: PartialEvent) => {
    console.log('added');
    router.push('/account/events/' + newEvent.path);
  };

  const router = useRouter();

  return (
    <Layout title='Add Event'>
      <CenteredSection backButtonText='Back' headerText='Add Event'>
        <AddEvent onAdd={onAdd}></AddEvent>
      </CenteredSection>
    </Layout>
  );
};
export default AddEventPage;

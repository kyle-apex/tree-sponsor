import EventDetailsForm from 'components/event/EventDetailsForm';
import Layout from 'components/layout/Layout';
import { PartialEvent } from 'interfaces';
import { useState } from 'react';

const AddEventPage = () => {
  const [event, setEvent] = useState<PartialEvent>();
  return (
    <Layout title='Add Event'>
      <EventDetailsForm event={event} setEvent={setEvent} />
    </Layout>
  );
};
export default AddEventPage;

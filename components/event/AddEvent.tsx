// TODO
import { useState, useCallback, useRef } from 'react';
import { PartialEvent } from 'interfaces';
import EventDetailsForm from './EventDetailsForm';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Box from '@mui/material/Box';

const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

const AddEvent = ({ onAdd }: { onAdd: (newEvent: PartialEvent) => void }) => {
  const eventRef = useRef<PartialEvent>({ startDate: tomorrow, endDate: null });
  const [isLoading, setIsLoading] = useState(false);

  const addEvent = async () => {
    console.log('eventRef.current', eventRef.current);
    setIsLoading(true);
    const newEvent = (await axios.post('/api/events', eventRef.current)) as PartialEvent;
    setIsLoading(false);
    onAdd(newEvent);
  };

  const updateAttribute = (name: keyof PartialEvent, value: unknown) => {
    eventRef.current = { ...eventRef.current, [name]: value };
  };

  return (
    <>
      <EventDetailsForm event={eventRef.current} updateAttribute={updateAttribute}></EventDetailsForm>
      <LoadingButton variant='contained' onClick={addEvent} isLoading={isLoading} sx={{ mt: 5 }}>
        Save
      </LoadingButton>
    </>
  );
};
export default AddEvent;

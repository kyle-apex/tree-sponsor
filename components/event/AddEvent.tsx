// TODO
import { useState, useCallback, useRef } from 'react';
import { PartialEvent } from 'interfaces';
import EventDetailsForm from './EventDetailsForm';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';

const AddEvent = ({ onAdd }: { onAdd: (newEvent: PartialEvent) => void }) => {
  const eventRef = useRef<PartialEvent>({});
  const [isLoading, setIsLoading] = useState(false);

  const addEvent = async () => {
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
      <LoadingButton variant='contained' onClick={addEvent} isLoading={isLoading}>
        Save
      </LoadingButton>
    </>
  );
};
export default AddEvent;

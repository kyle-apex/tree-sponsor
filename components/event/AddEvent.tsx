// TODO
import { useState, useEffect, useRef } from 'react';
import { PartialEvent } from 'interfaces';
import EventDetailsForm from './EventDetailsForm';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useSession } from 'next-auth/client';

const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

const AddEvent = ({ onAdd }: { onAdd: (newEvent: PartialEvent) => void }) => {
  const [session] = useSession();
  const eventRef = useRef<PartialEvent>({ startDate: tomorrow, endDate: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const addEvent = async () => {
    setIsLoading(true);
    const newEvent = (await axios.post('/api/events', eventRef.current))?.data as PartialEvent;
    setIsLoading(false);
    onAdd(newEvent);
  };

  const updateAttribute = (name: keyof PartialEvent | string, value: unknown) => {
    if (name.includes('.')) {
      const objectName = name.split('.')[0] as 'location' | 'trees' | 'categories';
      const propertyName = name.split('.')[1];

      const object = { ...eventRef.current[objectName], [propertyName]: value };

      eventRef.current = { ...eventRef.current, [objectName]: object };
    } else eventRef.current = { ...eventRef.current, [name]: value };

    validate(eventRef.current);
  };

  const validate = (event: PartialEvent) => {
    setIsValid(!!(event.name && event.path));
  };

  useEffect(() => {
    if (session?.user) updateAttribute('organizers', [session.user]);
  }, [session]);

  return (
    <>
      <EventDetailsForm event={eventRef.current} updateAttribute={updateAttribute}></EventDetailsForm>
      <LoadingButton variant='contained' onClick={addEvent} isLoading={isLoading} disabled={!isValid} sx={{ mt: 5 }}>
        Save
      </LoadingButton>
    </>
  );
};
export default AddEvent;

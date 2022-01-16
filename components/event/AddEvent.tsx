// TODO
import { useState, useCallback } from 'react';
import { PartialEvent } from 'interfaces';
import EventDetailsForm from './EventDetailsForm';
const AddEvent = () => {
  const [event, setEvent] = useState<PartialEvent>({});
  const setEventCallback = useCallback(setEvent, []);
  return (
    <>
      <EventDetailsForm event={event} setEvent={setEventCallback}></EventDetailsForm>
    </>
  );
};
export default AddEvent;

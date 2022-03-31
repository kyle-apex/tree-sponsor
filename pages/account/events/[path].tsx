// 1. Add event
// 2. View event page with edit buttons
// 3. Edit in place?

import LoadingButton from 'components/LoadingButton';
import { GetServerSidePropsContext } from 'next';
import { useRef, useState } from 'react';
import { PartialEvent } from 'interfaces';
import axios from 'axios';

const EditEventPage = ({ path }: { path: string }) => {
  console.log('path', path);
  const eventRef = useRef<PartialEvent>();
  const [isLoading, setIsLoading] = useState(false);

  const addEvent = async () => {
    setIsLoading(true);
    const newEvent = (await axios.post('/api/events', eventRef.current)) as PartialEvent;
    setIsLoading(false);
  };

  const updateAttribute = (name: keyof PartialEvent, value: unknown) => {
    eventRef.current = { ...eventRef.current, [name]: value };
  };

  return <></>;
};

export default EditEventPage;

// TODO replace this with regular, non-server side version
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;
  console.log('path', path);

  return { props: { path } };
}

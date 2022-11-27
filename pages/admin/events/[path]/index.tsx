// 1. Add event
// 2. View event page with edit buttons
// 3. Edit in place?

import LoadingButton from 'components/LoadingButton';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useRef, useState } from 'react';
import { PartialEvent } from 'interfaces';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddEvent from 'components/event/AddEvent';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import AdminLayout from 'components/layout/AdminLayout';
import EventDetailsForm from 'components/event/EventDetailsForm';

const EditEventPage = ({ path }: { path: string }) => {
  const router = useRouter();
  const eventRef = useRef<PartialEvent>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const readEvent = async (path: string): Promise<PartialEvent> => {
    setIsLoading(true);
    const event = (await axios.get(`/api/events/by-path?path=${path}`)).data as PartialEvent;

    eventRef.current = event;
    setIsLoading(false);
    return event;
  };

  const saveEvent = async () => {
    setIsSaving(true);
    const savedEvent = (await axios.patch('/api/events', eventRef.current)) as PartialEvent;
    router.push('/admin/events');
    setIsSaving(false);
  };

  useEffect(() => {
    readEvent(path);
  }, []);

  const updateAttribute = (name: keyof PartialEvent | string, value: unknown) => {
    if (name.includes('.')) {
      const objectName = name.split('.')[0] as 'location' | 'trees' | 'categories';
      const propertyName = name.split('.')[1];

      const object = { ...eventRef.current[objectName], [propertyName]: value };

      eventRef.current = { ...eventRef.current, [objectName]: object };
    } else eventRef.current = { ...eventRef.current, [name]: value };
  };

  return (
    <AdminLayout title='Edit Event'>
      <CenteredSection backButtonText='Back' headerText='Edit Event'>
        {eventRef.current && !isLoading && <EventDetailsForm event={eventRef.current} updateAttribute={updateAttribute}></EventDetailsForm>}
        <LoadingButton variant='contained' onClick={saveEvent} isLoading={isLoading || isSaving} sx={{ mt: 5 }}>
          Save
        </LoadingButton>
      </CenteredSection>
    </AdminLayout>
  );
};

export default EditEventPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let { path } = ctx.query;
  path = (path + '') as string;
  const response = await restrictPageAccess(ctx, 'hasEventManagement');
  response['props'] = { path: path };
  return response;
};

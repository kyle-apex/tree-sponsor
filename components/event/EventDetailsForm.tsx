// TODO
import { PartialEvent } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import CategoryMultiSelect from 'components/category/CategoryMultiSelect';
import DateTimeField from 'components/form/DateTimeField';
import Skeleton from '@mui/material/Skeleton';
import CenteredSection from 'components/layout/CenteredSection';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SplitRow from 'components/layout/SplitRow';

const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <>
      <Skeleton variant='text' sx={{ width: '15%' }} />
      <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 3 }} height={100} />
    </>
  ),
});

const EventDetailsForm = ({ event, setEvent }: { event: PartialEvent; setEvent: (event: PartialEvent) => void }) => {
  const updateAttribute = (name: string, value: unknown) => {
    const newEvent: PartialEvent = { ...event, [name]: value };
    setEvent(newEvent);
  };
  const router = useRouter();
  return (
    <CenteredSection>
      <Link href='/account'>
        <Button onClick={() => router.back()} variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
          <ChevronLeftIcon /> Back
        </Button>
      </Link>
      <TextField
        value={event?.name}
        onChange={e => updateAttribute('name', e.target.value)}
        label='Name'
        size='small'
        sx={{ marginBottom: 3 }}
        id='name-field'
      ></TextField>
      <SplitRow gap={2}>
        <DateTimeField
          value={event?.startDate}
          setValue={date => {
            updateAttribute('startDate', date);
          }}
          label='Start Time'
        ></DateTimeField>
        <DateTimeField
          value={event?.endDate}
          setValue={date => {
            updateAttribute('endDate', date);
          }}
          label='End Time'
        ></DateTimeField>
      </SplitRow>

      <Box sx={{ marginTop: 3, marginBottom: 3, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Description'
          placeholder='Enter a description of your event'
          value={event?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <CategoryMultiSelect
        selectedCategories={event?.categories}
        setSelectedCategories={categories => updateAttribute('categories', categories)}
      ></CategoryMultiSelect>
    </CenteredSection>
  );
};
export default EventDetailsForm;

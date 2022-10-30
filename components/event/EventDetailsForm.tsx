// TODO - Form Validation, Category Multi-select
import { PartialEvent } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import CategoryMultiSelect from 'components/category/CategoryMultiSelect';
import DateTimeField from 'components/form/DateTimeField';
import Skeleton from '@mui/material/Skeleton';
import SplitRow from 'components/layout/SplitRow';
import UniquePathField from 'components/form/UniquePathField';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';

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

const EventDetailsForm = ({
  event,
  updateAttribute,
}: {
  event: PartialEvent;
  updateAttribute: (name: keyof PartialEvent, value: unknown) => void;
}) => {
  const [hasActiveDates, setHasActiveDates] = useState(false);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate);
  const [activeStartDate, setActiveStartDate] = useState(event.activeStartDate);
  const [activeEndDate, setActiveEndDate] = useState(event.activeEndDate);

  const toggleHasActiveDates = () => {
    if (hasActiveDates) {
      event.activeStartDate = null;
      event.activeEndDate = null;
    } else {
      if (!event.activeStartDate) event.activeStartDate = event.startDate;
      if (!event.activeEndDate) event.activeEndDate = event.endDate;
    }
    setHasActiveDates(s => !s);
  };

  return (
    <>
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
          value={startDate}
          setValue={date => {
            // window['d2'] = date;
            console.log('date', date);
            updateAttribute('startDate', date);
            setStartDate(date);
          }}
          label='Start Time'
        ></DateTimeField>
        <DateTimeField
          value={endDate}
          setValue={date => {
            updateAttribute('endDate', date);
            setEndDate(date);
          }}
          label='End Time'
          minDateTime={startDate}
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
      <UniquePathField
        label='Event Link Path'
        initialValue={event.path}
        validatorPath='/events/is-duplicate-path?path='
        onChange={newValue => {
          updateAttribute('path', newValue);
        }}
      ></UniquePathField>
      <Box sx={{ marginTop: 2, marginBottom: -2 }}>
        <Checkbox checked={hasActiveDates} onChange={toggleHasActiveDates}></Checkbox> This event has a Tree ID/Thank-a-Tree Time Range that
        is different than the event time range
      </Box>
      <Collapse in={hasActiveDates}>
        <h6>Tree ID/Thank-a-Tree Time Range (Optional)</h6>
        <SplitRow gap={2}>
          <DateTimeField
            value={activeStartDate}
            setValue={date => {
              updateAttribute('activeStartDate', date);
              setActiveStartDate(date);
            }}
            label='Active Start Time'
          ></DateTimeField>
          <DateTimeField
            value={activeEndDate}
            setValue={date => {
              updateAttribute('activeEndDate', date);
              setActiveEndDate(date);
            }}
            minDateTime={event?.activeStartDate}
            label='Active End Time'
          ></DateTimeField>
        </SplitRow>
      </Collapse>
      <CategoryMultiSelect
        selectedCategories={event?.categories}
        setSelectedCategories={categories => updateAttribute('categories', categories)}
      ></CategoryMultiSelect>
    </>
  );
};
export default EventDetailsForm;

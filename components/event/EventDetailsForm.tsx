// TODO - Form Validation, Category Multi-select
import { PartialEvent, PartialUser } from 'interfaces';
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
import React, { useState } from 'react';
import LocationSelector from 'components/LocationSelector';
import { paramCase } from 'change-case';
import { useDebouncedCallback } from 'use-debounce';
import UserMultiSelect from './UserMultiSelect';
import DragDropTreeOrder from './DragDropTreeOrder';
import Typography from '@mui/material/Typography';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';

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

const now = new Date();

const EventDetailsForm = ({
  event,
  updateAttribute,
}: {
  event: PartialEvent;
  updateAttribute: (name: keyof PartialEvent | string, value: unknown) => void;
}) => {
  const [hasActiveDates, setHasActiveDates] = useState(false);
  const [startDate, setStartDate] = useState(event.startDate);
  const [name, setName] = useState(event.name || '');
  const [instagramPostId, setInstagramPostId] = useState(event.instagramPostId || '');
  const [reminderText, setReminderText] = useState(event.reminderText || '');

  const [path, setPath] = useState(event.path || '');
  const [locationName, setLocationName] = useState(event.location?.name || '');
  const [latitude, setLatitude] = useState(event.location?.latitude || 0);
  const [longitude, setLongitude] = useState(event.location?.longitude || 0);
  const debouncedSetLocation = useDebouncedCallback((latitude: number, longitude: number, address?: string) => {
    setLongitude(longitude);
    setLatitude(latitude);
    updateAttribute('location.latitude', latitude);
    updateAttribute('location.longitude', longitude);
    updateAttribute('location.address', address);
  }, 200);
  const [pictureUrl, setPictureUrl] = useState(event.pictureUrl);

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
        value={name}
        onChange={e => {
          const newName = e.target.value;
          updateAttribute('name', newName);
          setName(newName);
        }}
        onBlur={() => {
          if (!path && name) {
            const newPath = paramCase(name);
            setPath(newPath);
            updateAttribute('path', newPath);
          }
        }}
        label='Name'
        size='small'
        sx={{ marginBottom: 3 }}
        id='name-field'
      ></TextField>
      {now > event?.startDate && event?.id && (
        <TextField
          value={instagramPostId}
          onChange={e => {
            const newPostId = e.target.value;
            updateAttribute('instagramPostId', newPostId);
            setInstagramPostId(newPostId);
          }}
          label='Instagram Post Id'
          size='small'
          sx={{ marginBottom: 3 }}
          id='name-field'
          helperText='(ex: CvDTcUFuMO9 is the post id from instagram.com/p/CvDTcUFuMO9/)'
        ></TextField>
      )}

      <SplitRow gap={2}>
        <DateTimeField
          value={startDate}
          setValue={date => {
            // window['d2'] = date;
            updateAttribute('startDate', date);
            setStartDate(date);
          }}
          onClose={date => {
            if (date && !endDate) {
              if (!endDate) {
                const newEndDate = new Date(date.getTime());
                newEndDate.setHours(newEndDate.getHours() + 2);
                setEndDate(newEndDate);
                updateAttribute('endDate', newEndDate);
              }
            }
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

      {false && (
        <Box sx={{ marginTop: 3, marginBottom: 3, minHeight: '110px', display: 'block' }}>
          <TextEditor
            label='Description'
            placeholder='Enter a description of your event'
            value={event?.description}
            onChange={val => updateAttribute('description', val)}
          />
        </Box>
      )}
      {false && (
        <Box sx={{ mt: 3 }}>
          <UniquePathField
            label='Event Link Path'
            initialValue={path}
            validatorPath='/events/is-duplicate-path?path='
            onChange={newValue => {
              updateAttribute('path', newValue);
              setPath(newValue);
            }}
            disabled={!name}
          ></UniquePathField>
        </Box>
      )}
      <Box sx={{ marginTop: 3, marginBottom: 2, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Check-in Page Details'
          placeholder='Enter details to appear on the check-in page'
          value={event?.checkInDetails}
          onChange={val => updateAttribute('checkInDetails', val)}
        />
      </Box>
      <Box sx={{ marginTop: 3, marginBottom: 2, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='RSVP Page Description'
          placeholder='Enter details to appear on the RSVP page'
          value={event?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <TextField
        value={reminderText}
        onChange={e => {
          const newText = e.target.value;
          updateAttribute('reminderText', newText);
          setReminderText(newText);
        }}
        label='Reminder Email Text'
        placeholder='Enter custom text for the reminder email sent 24 hours before the event. If left blank, a default message will be used.'
        multiline
        rows={4}
        fullWidth
        sx={{ marginTop: 3, marginBottom: 2 }}
      />
      <ImageUploadAndPreview
        addSubtitleText='Click to add event image'
        imageUrl={pictureUrl}
        setImageUrl={(imageUrl: string) => {
          console.log('imageUrl', imageUrl);
          updateAttribute('pictureUrl', imageUrl);
          setPictureUrl(imageUrl);
        }}
      />
      <Box sx={{ marginBottom: 3, mt: 2 }}>
        <Checkbox defaultChecked={event?.isPrivate} onChange={e => updateAttribute('isPrivate', e.target.checked)}></Checkbox> Hide event
        from public view (test or private event)
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        <Checkbox defaultChecked={event?.hasSpecificTrees} onChange={e => updateAttribute('hasSpecificTrees', e.target.checked)}></Checkbox>
        Has event specific trees (Choose this option if you want to specify a sequence of trees or trees for this event span a large area)
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        <Checkbox defaultChecked={event?.hasNavigation} onChange={e => updateAttribute('hasNavigation', e.target.checked)}></Checkbox>
        Show navigation links to trees on species quiz (ex: bike tour or hike)
      </Box>
      <LocationSelector
        onViewportChange={({ latitude, longitude, address }) => {
          debouncedSetLocation(latitude, longitude, address);
        }}
        latitude={latitude ? Number(latitude) : null}
        longitude={longitude ? Number(longitude) : null}
        zoomToLocation={!latitude}
        onSelectedName={name => {
          if (!locationName && name) {
            setLocationName(name);
            updateAttribute('location.name', name);
          }
        }}
      ></LocationSelector>
      <TextField
        value={locationName}
        onChange={e => {
          setLocationName(e.target.value);
          updateAttribute('location.name', e.target.value);
        }}
        label='Location Name'
        size='small'
        sx={{ marginBottom: 3, marginTop: 4 }}
        id='name-field'
      ></TextField>
      {false && (
        <>
          <Box sx={{ marginTop: 2, marginBottom: -2 }}>
            <Checkbox checked={hasActiveDates} onChange={toggleHasActiveDates}></Checkbox> This event has a Tree ID/Thank-a-Tree Time Range
            that is different than the event time range
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
        </>
      )}
      {event?.id && event?.hasSpecificTrees && event?.trees?.length && (
        <>
          <Typography variant='h2' color='secondary'>
            Tree Ordering
          </Typography>
          <DragDropTreeOrder defaultTrees={event.trees}></DragDropTreeOrder>
        </>
      )}
      <Box mb={3}>
        <UserMultiSelect
          label='Add an Organizer'
          users={event.organizers}
          deleteDialogPropertyName='organizer'
          onUpdated={(users: PartialUser[]) => {
            updateAttribute('organizers', users);
          }}
        ></UserMultiSelect>
      </Box>
      {false && (
        <CategoryMultiSelect
          label='Add a Category'
          selectedCategories={event?.categories}
          onUpdated={categories => {
            updateAttribute('categories', categories);
          }}
        ></CategoryMultiSelect>
      )}
    </>
  );
};
export default EventDetailsForm;

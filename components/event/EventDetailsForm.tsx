// TODO
import { PartialEvent } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import TextEditor from 'components/TextEditor';
import CategoryMultiSelect from 'components/category/CategoryMultiSelect';
const EventDetailsForm = ({ event, setEvent }: { event: PartialEvent; setEvent: (event: PartialEvent) => void }) => {
  const updateAttribute = (name: string, value: unknown) => {
    const newEvent: PartialEvent = { ...event, [name]: value };
    setEvent(newEvent);
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

      <Box sx={{ marginBottom: 3, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Bio'
          placeholder='Enter a short bio to display on your profile...'
          value={event?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <CategoryMultiSelect
        selectedCategories={event?.categories}
        setSelectedCategories={categories => updateAttribute('categories', categories)}
      ></CategoryMultiSelect>
    </>
  );
};
export default EventDetailsForm;

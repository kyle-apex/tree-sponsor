import { useState, useCallback, useRef } from 'react';
import { PartialCategory } from 'interfaces';
import CategoryDetailsForm from './CategoryDetailsForm';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Box from '@mui/material/Box';

const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

const AddCategory = ({ onAdd }: { onAdd: (newCategory: PartialCategory) => void }) => {
  const categoryRef = useRef<PartialCategory>({});
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = async () => {
    setIsLoading(true);
    const newEvent = (await axios.post('/api/events', categoryRef.current)) as PartialCategory;
    setIsLoading(false);
    onAdd(newEvent);
  };

  const updateAttribute = (name: keyof PartialCategory, value: unknown) => {
    categoryRef.current = { ...categoryRef.current, [name]: value };
  };

  return (
    <>
      <CategoryDetailsForm category={categoryRef.current} updateAttribute={updateAttribute}></CategoryDetailsForm>
      <LoadingButton variant='contained' onClick={addCategory} isLoading={isLoading} sx={{ mt: 5 }}>
        Save
      </LoadingButton>
    </>
  );
};
export default AddCategory;

// TODO
import { useState, useEffect, useRef } from 'react';
import { PartialForm } from 'interfaces';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useSession } from 'next-auth/client';
import FormDetailsForm from './FormDetailsForm';

const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

const AddForm = ({ onAdd }: { onAdd: (newForm: PartialForm) => void }) => {
  const [session] = useSession();
  const formRef = useRef<PartialForm>({ completedMessage: 'Thank you for your response.', questionsJson: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const addForm = async () => {
    setIsLoading(true);
    const newForm = (await axios.post('/api/forms', formRef.current))?.data as PartialForm;
    setIsLoading(false);
    onAdd(newForm);
  };

  const updateAttribute = (name: keyof PartialForm | string, value: unknown) => {
    formRef.current = { ...formRef.current, [name]: value };

    validate(formRef.current);
  };

  const validate = (form: PartialForm) => {
    setIsValid(!!form.name && !!form.questionsJson);
  };

  return (
    <>
      <FormDetailsForm form={formRef.current} updateAttribute={updateAttribute}></FormDetailsForm>
      <LoadingButton variant='contained' onClick={addForm} isLoading={isLoading} disabled={!isValid} sx={{ mt: 5 }}>
        Save
      </LoadingButton>
    </>
  );
};
export default AddForm;

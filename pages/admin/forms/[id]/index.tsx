import LoadingButton from 'components/LoadingButton';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useRef, useState } from 'react';
import { PartialForm } from 'interfaces';
import axios from 'axios';
import CenteredSection from 'components/layout/CenteredSection';
import { useRouter } from 'next/router';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import AdminLayout from 'components/layout/AdminLayout';
import parsedGet from 'utils/api/parsed-get';
import FormDetailsForm from 'components/forms/FormDetailsForm';
import { update } from 'react-spring';

const EditFormPage = ({ id }: { id: number }) => {
  const router = useRouter();
  const formRef = useRef<PartialForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const readForm = async (id: number): Promise<PartialForm> => {
    setIsLoading(true);
    const form = (await parsedGet(`/api/forms/${id}`)) as PartialForm;
    delete form.formResponses;
    formRef.current = form;
    setIsLoading(false);
    return form;
  };

  const saveForm = async () => {
    setIsSaving(true);
    console.log('formRef.current', formRef.current);
    const savedForm = (await axios.patch('/api/forms/' + formRef.current.id, formRef.current)) as PartialForm;
    router.push('/admin/forms');
    setIsSaving(false);
  };

  useEffect(() => {
    readForm(id);
  }, []);

  const updateAttribute = (name: keyof PartialForm | string, value: unknown) => {
    formRef.current = { ...formRef.current, [name]: value };
  };

  return (
    <AdminLayout title='Edit Form'>
      <CenteredSection backButtonText='Back' headerText='Edit Form' maxWidth='90%'>
        {formRef.current && !isLoading && <FormDetailsForm form={formRef.current} updateAttribute={updateAttribute} />}
        <LoadingButton variant='contained' onClick={saveForm} isLoading={isLoading || isSaving} sx={{ mt: 5 }}>
          Save
        </LoadingButton>
      </CenteredSection>
    </AdminLayout>
  );
};

export default EditFormPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const response = await restrictPageAccess(ctx, 'hasFormManagement');
  response['props'] = { id: Number(id) };
  return response;
};

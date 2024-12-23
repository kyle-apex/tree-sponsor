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

const EditFormPage = ({ path }: { path: string }) => {
  const router = useRouter();
  const formRef = useRef<PartialForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const readForm = async (path: string): Promise<PartialForm> => {
    setIsLoading(true);
    const form = (await parsedGet(`/api/forms/by-path?path=${path}`)) as PartialForm;

    formRef.current = form;
    setIsLoading(false);
    return form;
  };

  const saveForm = async () => {
    setIsSaving(true);
    console.log('formRef.current', formRef.current);
    const savedForm = (await axios.patch('/api/forms', formRef.current)) as PartialForm;
    router.push('/admin/forms');
    setIsSaving(false);
  };

  useEffect(() => {
    readForm(path);
  }, []);

  const updateAttribute = (name: keyof PartialForm | string, value: unknown) => {
    formRef.current = { ...formRef.current, [name]: value };
  };

  return (
    <AdminLayout title='Edit Form'>
      <CenteredSection backButtonText='Back' headerText='Edit Form'>
        {formRef.current && !isLoading && <></>}
        <LoadingButton variant='contained' onClick={saveForm} isLoading={isLoading || isSaving} sx={{ mt: 5 }}>
          Save
        </LoadingButton>
      </CenteredSection>
    </AdminLayout>
  );
};

export default EditFormPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let { path } = ctx.query;
  path = (path + '') as string;
  const response = await restrictPageAccess(ctx, 'hasFormManagement');
  response['props'] = { path: path };
  return response;
};

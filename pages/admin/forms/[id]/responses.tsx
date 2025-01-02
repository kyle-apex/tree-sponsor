// Page that shows each answer in chronological order
// - If boolean/selection type, show a sum of each response type as well
// Select that shows Name (email)

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import AdminLayout from 'components/layout/AdminLayout';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { FormQuestion, PartialForm, PartialFormResponse } from 'interfaces';
import { GetServerSidePropsContext } from 'next/types';
import { JSXElementConstructor, Key, ReactElement, useEffect, useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';

// Page that shows readonly version of the form responses based on responsesJson
const ResponsesPage = ({ id }: { id: number }) => {
  const [form, setForm] = useState<PartialForm>();
  const [currentResponse, setCurrentResponse] = useState<PartialFormResponse>();
  const [currentResponseUserId, setCurrentResponseUserId] = useState<string>('');

  const readForm = async (id: number) => {
    const result = await axios.get('/api/forms/' + id);
    result.data?.formResponses?.forEach((formResponse: PartialFormResponse) => {
      for (const response of (formResponse.responsesJson as Partial<FormQuestion>[]) || []) response.options = response.value;
    });
    if (result.data) setForm(result.data);
  };

  useEffect(() => {
    if (currentResponse) return;

    if (form?.formResponses?.length) setCurrentResponseUserId(form.formResponses[0].userId + '');
  }, [form]);

  useEffect(() => {
    readForm(id);
  }, [id]);

  useEffect(() => {
    if (currentResponseUserId) {
      const response = form?.formResponses?.find(response => {
        return response.userId + '' == currentResponseUserId + '';
      });
      if (response) setCurrentResponse(response);
    }
    readForm(id);
  }, [currentResponseUserId]);

  return (
    <AdminLayout title='Form Responses'>
      <CenteredSection backButtonText='Back' headerText={form?.name} maxWidth='90%'>
        {form?.name && (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth={true}>
              <InputLabel>Responses ({form?.formResponses?.length || 0})</InputLabel>
              <Select
                value={currentResponseUserId}
                onChange={event => {
                  setCurrentResponseUserId(event.target.value);
                }}
                label={'Responses (' + form?.formResponses?.length + ')'}
              >
                {form.formResponses?.map(response => {
                  return (
                    <MenuItem value={response.userId + ''} key={response.userId}>
                      {response.user?.name} ({response.user?.email})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}
        {form?.name &&
          process.browser &&
          (currentResponse?.responsesJson as Partial<FormQuestion>[])?.map(response => {
            if (!response) return;

            const question = (form.questionsJson as Partial<FormQuestion>[]).find(q => q.question == response.question);
            if (question?.options?.length && !response.options?.length) response.options = question.options;

            return (
              <Box
                key={response.question}
                className='question-container box-shadow'
                flexDirection='column'
                sx={{
                  display: 'flex',
                  mb: 3,
                  border: 'solid 1px #f1f1f1',
                  borderRadius: '5px',
                  padding: '15px 15px 20px',
                  backgroundColor: '#f8f8f8',
                }}
              >
                <Typography variant='h6' color='primary' sx={{ fontWeight: '600', display: 'inline', fontSize: '1.1rem' }}>
                  {response.question}
                  {response.required && <span style={{ color: '#d32f2f', fontWeight: 400, marginLeft: '2px' }}>*</span>}
                </Typography>
                {response.description && (
                  <Typography variant='body2' sx={{ mt: 0.5 }}>
                    {response.description}
                  </Typography>
                )}
                <Box sx={{ mt: 1 }}>
                  {(response.type == 'text' ||
                    response.type == 'multiline' ||
                    response.type == 'user-email' ||
                    response.type == 'user-name' ||
                    response.type == 'profile-title' ||
                    response.type == 'profile-bio') && (
                    <TextField
                      size='small'
                      fullWidth
                      multiline={response.type == 'multiline' || response.type == 'profile-bio'}
                      sx={{ '.MuiInputBase-multiline': { backgroundColor: 'transparent' } }}
                      value={response.value}
                      disabled={true}
                      variant='standard'
                    ></TextField>
                  )}

                  {response.type == 'checkbox' &&
                    response?.options?.map((option: any) => (
                      <FormControlLabel
                        key={option}
                        control={<Checkbox disabled={true} checked={response?.value?.includes(option)} />}
                        label={option}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  {response.type == 'radio' && (
                    <RadioGroup value={response.value} name={response.question}>
                      {question?.options?.map((option: any) => (
                        <FormControlLabel key={option} control={<Radio disabled={true} />} label={option} value={option} sx={{ mb: 1 }} />
                      ))}
                    </RadioGroup>
                  )}
                  {(response.type == 'image' || response.type == 'user-image') && (
                    <Box sx={{ textAlign: 'center' }}>
                      {response.value && (
                        <img
                          alt='Cropped Image'
                          src={response.value}
                          style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto', flex: '1 0 200px' }}
                        ></img>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
      </CenteredSection>
    </AdminLayout>
  );
};
export default ResponsesPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const response = await restrictPageAccess(ctx, 'hasFormManagement');
  response['props'] = { id: Number(id) };
  return response;
};

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { GetServerSidePropsContext } from 'next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ImageCropper, { ImageCropperWrapper } from 'components/ImageCropper';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from 'utils/hooks/use-local-storage';
import formatServerProps from 'utils/api/format-server-props';
import { prisma } from 'utils/prisma/init';
import { FormQuestion, FormState, PartialForm } from 'interfaces';
import Button from '@mui/material/Button';

const FormPage = ({ form }: { form: PartialForm }) => {
  if (!form)
    return (
      <Layout title={form?.name || 'Form not found'}>
        <LogoMessage justifyContent='start' maxWidth='sm'>
          Form not found
        </LogoMessage>
      </Layout>
    );

  //const form = exampleForm;
  console.log('form', form);
  const [formState, setFormState] = useLocalStorage<FormState>('form:' + form.name?.replaceAll(' ', '_'), { questions: [] });

  // helper function for updating a value
  const updateStateValue = useCallback(
    (questionState: Partial<FormQuestion>, value: any) => {
      questionState.value = value;
      setFormState(s => {
        return { questions: [...s.questions] };
      });
    },
    [formState],
  );
  // initialize and set defaults
  useEffect(() => {
    const initializedQuestionStates: Partial<FormQuestion>[] = [];
    form.questions.map((question, idx) => {
      let questionState = formState.questions?.find(q => q.question == question.question);
      if (!questionState) {
        questionState = { question: question.question, type: question.type, value: question.default };
        if (!questionState.value && question.type == 'checkbox') questionState.value = [];

        initializedQuestionStates.push(questionState);
      }
    });
    console.log('initializedQuestionStates', initializedQuestionStates);
    if (initializedQuestionStates?.length)
      setFormState(s => {
        return { ...s, questions: [...s.questions, ...initializedQuestionStates] };
      });
  }, [formState]);
  console.log('formState', formState?.questions?.length);
  return (
    <Layout title={form.name}>
      <LogoMessage justifyContent='start' maxWidth='sm'>
        <Box sx={{ mb: 3 }}>
          <Typography variant='h2' color='secondary' sx={{ mb: 1 }}>
            {form.name}
          </Typography>
          {form.description && <SafeHTMLDisplay html={form.description}></SafeHTMLDisplay>}
        </Box>
        {process.browser &&
          form.questions.map((question, idx) => {
            const questionState = formState.questions?.find(q => q.question == question.question);

            console.log('loading', question.question, typeof questionState?.value, questionState?.value);

            if (!questionState) return;

            return (
              <Box
                key={question.question}
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
                  {question.question}
                  {question.required && <span style={{ color: '#d32f2f', fontWeight: 400, marginLeft: '2px' }}>*</span>}
                </Typography>
                {question.description && (
                  <Typography variant='body2' sx={{ mt: 0.5 }}>
                    {question.description}
                  </Typography>
                )}
                <Box sx={{ mt: 1 }}>
                  {(question.type == 'text' || question.type == 'multiline') && (
                    <TextField
                      size='small'
                      fullWidth
                      multiline={question.type == 'multiline'}
                      sx={{ '.MuiInputBase-multiline': { backgroundColor: 'transparent' } }}
                      placeholder={question.placeholder || 'Your answer'}
                      defaultValue={question.default}
                      value={questionState.value}
                      onChange={event => {
                        updateStateValue(questionState, event.target.value);
                      }}
                      variant='standard'
                    ></TextField>
                  )}

                  {question.type == 'checkbox' &&
                    question.options.map(option => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={questionState.value?.includes(option)}
                            onChange={(event, checked) => {
                              console.log('questionState.value', questionState.value);

                              if (checked && !questionState.value.includes(option)) questionState.value.push(option);
                              else if (!checked && questionState.value.includes(option)) {
                                questionState.value.splice(questionState.value.indexOf(option), 1);
                              }

                              updateStateValue(questionState, questionState.value);
                            }}
                          />
                        }
                        label={option}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  {question.type == 'radio' && (
                    <RadioGroup
                      value={questionState.value}
                      onChange={(_event, value) => updateStateValue(questionState, value)}
                      name={question.question}
                    >
                      {question.options.map(option => (
                        <FormControlLabel key={option} control={<Radio />} label={option} value={option} sx={{ mb: 1 }} />
                      ))}
                    </RadioGroup>
                  )}
                  {question.type == 'image' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <ImageCropperWrapper
                        croppedImage={questionState.value}
                        setCroppedImage={(url: any) => {
                          updateStateValue(questionState, url);
                        }}
                        subtitle={question.placeholder}
                      ></ImageCropperWrapper>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        <Button
          fullWidth
          variant='contained'
          color='primary'
          size='large'
          sx={{ mt: 2, mb: 12 }}
          onClick={() => {
            console.log('clicked');
          }}
        >
          Submit
        </Button>
      </LogoMessage>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;
  console.log('path', path);
  try {
    const form = (await prisma.form.findFirst({
      where: { path: path + '' },
    })) as PartialForm;
    console.log('form', form);
    form.questions = form.questionsJson as unknown as FormQuestion[];
    console.log('form', form);
    formatServerProps(form);

    return { props: { form: form } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { form: null } };
}

export default FormPage;

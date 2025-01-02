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
import { FormQuestion, FormState, PartialForm, PartialUser, Session } from 'interfaces';
import axios from 'axios';
import LoadingButton from 'components/LoadingButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useSession } from 'next-auth/client';
import Button from '@mui/material/Button';
import Link from 'next/link';

const FormPage = ({ form }: { form: PartialForm }) => {
  if (!form)
    return (
      <Layout title={form?.name || 'Form not found'}>
        <LogoMessage justifyContent='start' maxWidth='sm'>
          Form not found
        </LogoMessage>
      </Layout>
    );

  const [formState, setFormState] = useLocalStorage<FormState>('form:' + form.path, { questions: [], isValid: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentUser, setCurrentUser] = useState<PartialUser>(null);
  const [nextSession] = useSession();
  const [isCompleted, setIsCompleted] = useState(false);

  const submit = async (responses: Partial<FormQuestion>[]) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/forms/' + form.id + '/responses', { responsesJson: responses, formId: form.id });
    } catch (err) {
      setShowError(true);
    }
    setIsSubmitting(false);
    setIsCompleted(true);
  };

  // helper function for updating a value
  const updateStateValue = useCallback(
    (questionState: Partial<FormQuestion>, value: any) => {
      questionState.value = value;
      setFormState(s => {
        return { ...s, questions: [...s.questions] };
      });
    },
    [formState],
  );
  // initialize and set defaults
  useEffect(() => {
    const initializedQuestionStates: Partial<FormQuestion>[] = [];
    form.questions.map(question => {
      let questionState = formState.questions?.find(q => q.question == question.question);
      if (!questionState) {
        questionState = { question: question.question, type: question.type, value: question.default };
        if (!questionState.value && question.type == 'checkbox') questionState.value = [];

        initializedQuestionStates.push(questionState);
      }
    });
    if (initializedQuestionStates?.length)
      setFormState(s => {
        return { ...s, questions: [...s.questions, ...initializedQuestionStates] };
      });
  }, [formState]);

  const getInitialUserData = async () => {
    console.log('currentUser?.email', currentUser?.email);
    if (currentUser?.email) return;
    const session = nextSession as Session;

    let user = session?.user;
    let image = user?.image;
    let email = user?.email;
    let name = user?.name;
    let title = user?.profile?.title;
    let bio = user?.profile?.bio;

    if (user?.id) {
      const existingResponse = await axios.get('/api/forms/' + form.id + '/responses/me');

      if (existingResponse?.data?.responsesJson?.length) {
        setCurrentUser(user);
        setTimeout(() => {
          setFormState(s => {
            return { ...s, questions: existingResponse.data.responsesJson };
          });
        }, 1);

        formState.questions = existingResponse.data.responsesJson;
      }
    }

    const emailQuestionState = formState?.questions?.find(q => q.type == 'user-email');

    const nameQuestionState = formState?.questions?.find(q => q.type == 'user-name');

    const imageQuestionState = formState?.questions?.find(q => q.type == 'user-image');
    const bioQuestionState = formState?.questions?.find(q => q.type == 'profile-bio');
    const titleQuestionState = formState?.questions?.find(q => q.type == 'profile-title');

    if (
      !emailQuestionState ||
      !nameQuestionState ||
      (emailQuestionState?.value &&
        nameQuestionState?.value &&
        imageQuestionState?.value &&
        bioQuestionState?.value &&
        titleQuestionState?.value)
    )
      return;

    if (!email) {
      try {
        email = JSON.parse(window.localStorage.getItem('checkinEmail'));
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }

    if (!email && emailQuestionState.value && emailQuestionState.value.includes('@') && emailQuestionState.value.includes('.'))
      email = emailQuestionState.value;

    let hasChange;

    if (email && (!name || !image || !title || !bio)) {
      user = (await axios.get('/api/users/by-email?email=' + encodeURIComponent(email)))?.data as PartialUser;
      if (user?.name) {
        name = user?.name;
      }
      if (user?.image) {
        image = user?.image;
      }
      if (user?.profile?.bio) {
        bio = user.profile.bio.replace(/<\/?[^>]+(>|$)/g, '');
      }
      if (user?.profile?.title) {
        title = user.profile.title;
      }
    }

    if (email && emailQuestionState && !emailQuestionState.value) {
      hasChange = true;
      emailQuestionState.value = email;
    }

    if (name && nameQuestionState && !nameQuestionState.value) {
      hasChange = true;
      nameQuestionState.value = name;
    }

    if (image && imageQuestionState && !imageQuestionState?.value) {
      hasChange = true;
      imageQuestionState.value = image;
    }

    if (bio && bioQuestionState && !bioQuestionState?.value) {
      hasChange = true;
      bioQuestionState.value = bio;
    }

    if (title && titleQuestionState && !titleQuestionState?.value) {
      hasChange = true;
      titleQuestionState.value = title;
    }

    if (hasChange)
      setFormState(s => {
        return { ...s, questions: [...s.questions] };
      });

    if (user?.email) setCurrentUser(user);
  };

  // get initial user data
  useEffect(() => {
    getInitialUserData();
  }, [nextSession, formState, currentUser]);

  useEffect(() => {
    const isValid = form.questions?.reduce((isValidSoFar, currentQuestion) => {
      const currentState = formState.questions.find(q => q.question == currentQuestion.question);
      //console.log('currentQuestion', isValidSoFar, currentQuestion, currentState);
      isValidSoFar =
        !!(
          !currentQuestion.required ||
          (currentState?.value && currentQuestion.type != 'checkbox') ||
          (currentState?.value?.length && currentQuestion.type == 'checkbox')
        ) && isValidSoFar;
      return isValidSoFar;
    }, true);
    setFormState(s => {
      return { ...s, isValid };
    });
  }, [form.questions, formState.questions]);

  return (
    <Layout title={form.name}>
      <LogoMessage justifyContent='start' maxWidth='md'>
        <Box sx={{ mb: 3 }}>
          <Typography variant='h2' color='secondary' sx={{ mb: 1 }}>
            {form.name}
          </Typography>
          {form.description && !isCompleted && <SafeHTMLDisplay html={form.description}></SafeHTMLDisplay>}
        </Box>
        {!isCompleted &&
          process.browser &&
          form.questions.map(question => {
            const questionState = formState.questions?.find(q => q.question == question.question);

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
                  {(question.type == 'text' ||
                    question.type == 'multiline' ||
                    question.type == 'user-email' ||
                    question.type == 'user-name' ||
                    question.type == 'profile-title' ||
                    question.type == 'profile-bio') && (
                    <TextField
                      size='small'
                      fullWidth
                      multiline={question.type == 'multiline' || question.type == 'profile-bio'}
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
                            onChange={(_event, checked) => {
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
                  {(question.type == 'image' || question.type == 'user-image') && (
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
        {!isCompleted && (
          <LoadingButton
            isLoading={isSubmitting}
            variant='contained'
            color='primary'
            size='large'
            disabled={!formState.isValid}
            sx={{ mt: 2, mb: 6 }}
            onClick={() => {
              submit(formState.questions);
            }}
          >
            Submit
          </LoadingButton>
        )}
        {isCompleted && <SafeHTMLDisplay html={form.completedMessage || 'Thank you for your response.'}></SafeHTMLDisplay>}
        {isCompleted && (
          <Box sx={{ mt: 5 }}>
            {!nextSession?.user?.email && (
              <Link href='/signin'>
                <Button fullWidth color='primary' variant='contained' sx={{ mb: 2 }}>
                  Login with your E-mail
                </Button>
              </Link>
            )}
            <a href='https://meetup.tfyp.org' target='_meetup' rel='noreferrer' style={{ width: '100%', textDecoration: 'none' }}>
              <Button variant='outlined' color='secondary' sx={{ mb: 2, width: '100%' }}>
                Upcoming Events on Meetup
              </Button>
            </a>
            <a
              href='https://www.instagram.com/treefolks_yp/'
              target='_instagram'
              rel='noreferrer'
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <Button variant='outlined' sx={{ mb: 2, width: '100%' }}>
                Follow @treefolks_yp on Instagram
              </Button>
            </a>
          </Box>
        )}
        <Snackbar
          open={showError}
          autoHideDuration={10000}
          onClose={() => {
            setShowError(false);
          }}
        >
          <Alert onClose={() => setShowError(false)} severity='error' color='error' sx={{ width: '100%' }}>
            Error submitting form! Please try again
          </Alert>
        </Snackbar>
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
    formatServerProps(form);

    return { props: { form: form } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { form: null } };
}

export default FormPage;

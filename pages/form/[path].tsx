import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { PartialCategory } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ImageCropper, { ImageCropperWrapper } from 'components/ImageCropper';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from 'utils/hooks/use-local-storage';
import FormControl from '@mui/material/FormControl';

type FormQuestionType = 'text' | 'multiline' | 'checkbox' | 'radio' | 'image';
class FormQuestion {
  question: string;
  description: string;
  type: FormQuestionType;
  placeholder: string;
  required: boolean;
  options: string[];
  default: any;
  value: any;
  delayedValue: any;
}
class FormState {
  questions: Partial<FormQuestion>[];
}
class PartialForm {
  name: string;
  description: string;
  id: number;
  questions: FormQuestion[];
}

const exampleForm = {
  name: 'Core Team Participation Agreement',
  description: `<p>To complete the process of joining the Core Team, please complete the following to:</p><ul><li>Agree to the Core Team commitments</li><li>Setup your bio for the TreeFolksYP website</li></ul>`,
  questions: [
    {
      question: 'Name',
      description: 'hey',
      type: 'text',
      placeholder: '',
      required: true,
    },
    {
      question: 'Email',
      description: '',
      type: 'text',
      placeholder: 'Your email',
      required: true,
    },
    {
      question: 'I agree to do my best to attend at least 50% of Core Team meetings.',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description:
        'Meetings will be 6:30-8pm on Wednesdays (typically the second Wednesday of the month).  Half will be virtual on Zoom, but the first two will be in person.',
    },
    {
      question: 'I agree to assist in the planning of at least one event this year.',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description: '',
    },
    {
      question: 'I agree to provide my input by filling out surveys, etc.',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description: '',
    },
    {
      question: 'I agree to maintain active TreeFolksYP membership.',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description:
        'Signup at https://treefolks.org/yp with a membership donation level starting at $20/year directly to TreeFolks (tax-deductible)',
    },
    {
      question: 'I agree to help promote TreeFolksYP events that I plan to attend to people in my network',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description: '',
    },
    {
      question: 'If I need to end my membership on the Core Team, I will communicate with the TFYP Executive Committee.',
      required: true,
      options: ['I agree'],
      type: 'checkbox',
      description: '',
    },
    {
      question: 'Website Bio',
      required: true,
      options: ['Include my bio on the website', 'I do not want to be listed on the TreeFolks Core Team website'],
      type: 'radio',
      default: 'Include my bio on the website',
      description: 'Please complete the following for the Core Team section on the TreeFolks website https://treefolks.org/yp',
    },
    {
      question: 'Website Bio: Title/Occupation (Ex: Accountant, Engineer)',
      required: false,
      type: 'text',
      description: '',
    },
    {
      question: 'Website Bio: Short 2-3 sentence bio covering your interest in TreeFolks/environment',
      required: false,
      type: 'multiline',
      description: `Ex: I spend my days working on my computer, so I love a chance to get outside, enjoy nature, and play sports (tennis, volleyball, flag football).  Unfortunately, I don't have a place to plant trees of my own, but TreeFolks gives me a chance to support planting trees all across Austin!`,
    },
    {
      question: 'Website Bio: Headshot (square shaped picture would work best)',
      required: false,
      type: 'image',
      description: `Don’t have one you like? Head outside and take a quick selfie with some greenery in the background!`,
      placeholder: 'Add headshot',
    },
  ],
};

const FormPage = ({ form }: { form: PartialForm }) => {
  //const form = exampleForm;
  console.log('form', form);
  const [formState, setFormState] = useLocalStorage<FormState>('form:' + form.name?.replaceAll(' ', '_'), { questions: [] });
  const updateStateValue = useCallback(
    (questionState: Partial<FormQuestion>, value: any) => {
      questionState.value = value;
      setFormState(s => {
        return { questions: [...s.questions] };
      });
    },
    [formState],
  );
  useEffect(() => {
    const initializedQuestionStates: Partial<FormQuestion>[] = [];
    form.questions.map((question, idx) => {
      let questionState = formState.questions?.find(q => q.question == question.question);
      if (!questionState) {
        console.log('setting defaults', JSON.stringify(formState.questions));
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
            /*
            if (!questionState) {
              console.log('setting defaults', JSON.stringify(formState.questions));
              questionState = { question: question.question, type: question.type, value: question.default };
              setFormState(s => {
                return { ...s, questions: [...s.questions, questionState] };
              });
            }
            if (!questionState.value && question.type == 'checkbox') questionState.value = [];*/
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
      </LogoMessage>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  /*try {
   // const results = await axios.get(process.env.URL + '/api/categories/' + path);
    return { props: { form: results.data } };
  } catch (err) {
    console.log('err', err);
  }*/
  return { props: { form: exampleForm } };
}

export default FormPage;

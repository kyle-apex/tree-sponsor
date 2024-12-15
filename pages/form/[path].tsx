import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { PartialCategory } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { Typography } from '@mui/material';

type FormQuestionType = 'text' | 'multiline' | 'boolean';
class FormQuestion {
  question: string;
  description: string;
  type: FormQuestionType;
  placeholder: string;
  required: boolean;
}
class PartialForm {
  name: string;
  description: string;
  id: number;
  questions: FormQuestion[];
}

const exampleForm = {
  name: 'Participation Agreement',
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
  ],
};

const FormPage = ({ form }: { form: PartialForm }) => {
  console.log('form', form);
  return (
    <Layout title='Sign In' header='Form Name'>
      <LogoMessage justifyContent='start'>
        <Typography variant='h2' color='secondary' sx={{ mb: 3 }}>
          {form.name}
        </Typography>
        <SafeHTMLDisplay html={form.description}></SafeHTMLDisplay>
        {form.questions.map((question, idx) => {
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
              <Typography variant='h6' color='primary' sx={{ fontWeight: '600', display: 'inline' }}>
                {question.question}
                {question.required && <span style={{ color: '#d32f2f', fontWeight: 400, marginLeft: '2px' }}>*</span>}
              </Typography>
              {question.description && (
                <Typography variant='body2' sx={{ mt: 0.5 }}>
                  {question.description}
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                {question.type == 'text' && (
                  <TextField size='small' fullWidth placeholder={question.placeholder || 'Your answer'} variant='standard'></TextField>
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

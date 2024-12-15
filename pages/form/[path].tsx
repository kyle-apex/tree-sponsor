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

type FormQuestionType = 'text' | 'multiline' | 'boolean';
class FormQuestion {
  question: string;
  description: string;
  type: FormQuestionType;
  placeholder: string;
  required: boolean;
  checkboxLabel: string;
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
      checkboxLabel: 'I agree',
      type: 'boolean',
      description:
        'Meetings will be 6:30-8pm on Wednesdays (typically the second Wednesday of the month).  Half will be virtual on Zoom, but the first two will be in person.',
    },
  ],
};

const FormPage = ({ form }: { form: PartialForm }) => {
  console.log('form', form);
  return (
    <Layout title={form.name}>
      <LogoMessage justifyContent='start'>
        <Box sx={{ mb: 3 }}>
          <Typography variant='h2' color='secondary' sx={{ mb: 1 }}>
            {form.name}
          </Typography>
          {form.description && <SafeHTMLDisplay html={form.description}></SafeHTMLDisplay>}
        </Box>
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
                {question.type == 'text' && (
                  <TextField size='small' fullWidth placeholder={question.placeholder || 'Your answer'} variant='standard'></TextField>
                )}
                {question.type == 'boolean' && <FormControlLabel control={<Checkbox />} label={question.checkboxLabel} />}
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

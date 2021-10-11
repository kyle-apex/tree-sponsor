import { TextField, Button, LinearProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

const Contact = () => {
  const classes = useStyles();
  const [name, setName] = useState('');

  let localEmail = '';
  try {
    localEmail = JSON.parse(window.localStorage.getItem('signInEmail'));
    // eslint-disable-next-line no-empty
  } catch (err) {}

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState('');

  // set the default value if available after delay to resolve TextField label issue
  useEffect(() => {
    setTimeout(() => {
      setEmail(localEmail);
    });
  }, []);

  const submitMessage = async () => {
    setStatus('sending');
    await axios.post('/api/contact', { email, subject, message, name });
    setStatus('sent');
    setMessage('');
    setSubject('');
  };

  return (
    <Layout>
      <LogoMessage hideLogo={true}>
        <Typography color='secondary' variant='h1'>
          Contact Us
        </Typography>
        <TextField
          label='Email'
          value={email}
          key={email}
          onChange={e => {
            setStatus('');
            setEmail(e.target.value);
          }}
          variant='outlined'
          className={classes.formField}
          disabled={status == 'sending'}
        ></TextField>
        <TextField
          label='Name'
          value={name}
          onChange={e => {
            setStatus('');
            setName(e.target.value);
          }}
          variant='outlined'
          className={classes.formField}
          disabled={status == 'sending'}
        ></TextField>

        <TextField
          value={subject}
          onChange={e => {
            setStatus('');
            setSubject(e.target.value);
          }}
          label='Subject'
          variant='outlined'
          className={classes.formField}
          disabled={status == 'sending'}
        ></TextField>
        <TextField
          label='Message'
          multiline={true}
          value={message}
          rows={5}
          onChange={e => {
            setStatus('');
            setMessage(e.target.value);
          }}
          variant='outlined'
          className={classes.formField}
          disabled={status == 'sending'}
        ></TextField>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => submitMessage()}
          size='large'
          disabled={status == 'sending' || !(email && message && subject)}
        >
          Send Message
        </Button>
        {status === 'sent' && <p>Thank you for contacting us. Your message will be reviewed shortly.</p>}
        {status === 'sending' && <LinearProgress></LinearProgress>}
      </LogoMessage>
    </Layout>
  );
};

export default Contact;

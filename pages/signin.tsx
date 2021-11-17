import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import { providers, signIn, getSession, csrfToken, ClientSafeProvider } from 'next-auth/client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';

import useLocalStorage from 'utils/hooks/use-local-storage';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: theme.spacing(1),
  },
}));

//https://javascript.plainenglish.io/how-to-create-a-custom-sign-in-page-in-next-auth-1612dc17beb7
export default function signin({
  providers,
  csrfToken,
  message: warningMessage,
  error: errorType,
}: {
  providers: Record<string, ClientSafeProvider>;
  csrfToken: string;
  message: string;
  error: string;
}) {
  const classes = useStyles();
  const [message, setMessage] = useState(warningMessage);

  // We only want to render providers

  const errors: Record<string, string> = {
    Signin: 'Try signing with a different account.',
    OAuthSignin: 'Try signing with a different account.',
    OAuthCallback: 'Try signing with a different account.',
    OAuthCreateAccount: 'Try signing with a different account.',
    EmailCreateAccount: 'Try signing with a different account.',
    Callback: 'Try signing with a different account.',
    OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'Please enter a valid email address.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    default: 'Unable to sign in.',
  };

  const error: string = errorType && (errors[errorType] ?? errors.default);
  const [email, setEmail] = useLocalStorage('signInEmail', '');

  return (
    <Layout title='Sign In'>
      <LogoMessage>
        {error && (
          <div className='center'>
            <p>{error}</p>
          </div>
        )}
        {message && (
          <div className='center'>
            <h2>Check your email</h2>
            <p>
              {message}: {email || ''}
            </p>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={() => {
                setMessage('');
              }}
            >
              Retry Login
            </Button>
          </div>
        )}
        {!message && (
          <>
            {Object.values(providers).map((provider: ClientSafeProvider) => {
              return (
                <div key={provider.name} className='provider'>
                  {provider.type === 'oauth' && (
                    <Button variant='outlined' className={classes.button} fullWidth color='primary' onClick={() => signIn(provider.id)}>
                      Sign in with {provider.name}
                    </Button>
                  )}
                  {provider.type === 'email' && (
                    <>
                      <p className='center'>OR</p>
                      <form action={provider.signinUrl} method='POST'>
                        <input type='hidden' name='csrfToken' value={csrfToken} />

                        <TextField
                          color='primary'
                          fullWidth
                          id={`input-email-for-${provider.id}-provider`}
                          autoFocus
                          type='text'
                          name='email'
                          value={email}
                          size='small'
                          onChange={e => {
                            setEmail(e.target.value);
                          }}
                          placeholder='email@example.com'
                          variant='outlined'
                          margin='dense'
                        />
                        <Button color='primary' fullWidth variant='outlined' type='submit'>
                          Sign in with {provider.name}
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              );
            })}
            <hr style={{ width: '100%', marginTop: '40px' }} />

            <Box flexDirection='row' sx={{ display: 'flex', marginBottom: -3, marginTop: -0.5 }} gap={1.5}>
              <Link href='/signup'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Start a new account</Typography>
                </a>
              </Link>
              |
              <Link href='/contact'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Help</Typography>
                </a>
              </Link>
            </Box>
          </>
        )}
      </LogoMessage>
    </Layout>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    console.log('something about context %j', context);
    console.log('session from logout', session);
    return {
      redirect: { destination: context.query.callbackUrl || '/account' },
    };
  }

  return {
    props: {
      providers: await providers(),
      csrfToken: await csrfToken(context),
      callbackUrl: context.query.callbackUrl || '',
      error: context.query.error || '',
      message: context.query.message || '',
    },
  };
}

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
            <Box sx={{ marginBottom: 3 }} component='p'>
              Sign in with any method using the same email address you signed up with:
            </Box>
            {Object.values(providers).map((provider: ClientSafeProvider) => {
              return (
                <div key={provider.name} className='provider'>
                  {provider.type === 'oauth' && provider.name != 'Google' && (
                    <Button variant='outlined' className={classes.button} fullWidth color='primary' onClick={() => signIn(provider.id)}>
                      Sign in with {provider.name}
                    </Button>
                  )}
                  {provider.name === 'Google' && (
                    <button className='gsi-material-button' onClick={() => signIn(provider.id)}>
                      <div className='gsi-material-button-state'></div>
                      <div className='gsi-material-button-content-wrapper'>
                        <div className='gsi-material-button-icon'>
                          <svg
                            version='1.1'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 48 48'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                            style={{ display: 'block' }}
                          >
                            <path
                              fill='#EA4335'
                              d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                            ></path>
                            <path
                              fill='#4285F4'
                              d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                            ></path>
                            <path
                              fill='#FBBC05'
                              d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                            ></path>
                            <path
                              fill='#34A853'
                              d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                            ></path>
                            <path fill='none' d='M0 0h48v48H0z'></path>
                          </svg>
                        </div>
                        <span className='gsi-material-button-contents'>Sign in with Google</span>
                        <span style={{ display: 'none' }}>Sign in with Google</span>
                      </div>
                    </button>
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
    return {
      redirect: {
        destination:
          context.query.callbackUrl &&
          (context.query.callbackUrl.includes('/u/') ||
            context.query.callbackUrl.includes('/checkin') ||
            context.query.callbackUrl.includes('/map'))
            ? context.query.callbackUrl
            : '/account',
      },
    };
  }

  return {
    props: {
      providers: await providers(),
      csrfToken: await csrfToken(context),
      callbackUrl: context.query.callbackUrl || '/account',
      error: context.query.error || '',
      message: context.query.message || '',
    },
  };
}

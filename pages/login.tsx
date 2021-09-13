import { Button, makeStyles } from '@material-ui/core';
import { signIn, useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
const useStyles = makeStyles(() => ({
  loginButton: {},
}));

const Login = () => {
  const [session] = useSession();
  const router = useRouter();

  const classes = useStyles();

  return (
    <div>
      {!session && (
        <div>
          <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => signIn()}>
            Login
          </Button>
          <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => router.push('/signup')}>
            Register
          </Button>
        </div>
      )}
      {session && (
        <div>
          <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => router.push('/account')}>
            Continue to Account
          </Button>
          <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
export default Login;

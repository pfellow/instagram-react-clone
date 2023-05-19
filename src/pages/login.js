import React, { useState, useContext } from 'react';
import { useLoginPageStyles } from '../styles';
import SEO from '../components/shared/Seo';
import {
  Button,
  Card,
  CardHeader,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FaceBookIconBlue from '../images/facebook-icon-blue.svg';
import FaceBookIconWhite from '../images/facebook-icon-white.png';
import { AuthContext } from '../auth';
import { useHistory } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useApolloClient } from '@apollo/client';
import { GET_USER_EMAIL } from '../graphql/queries';
import { AuthError } from './signup';

function LoginPage() {
  const styles = useLoginPageStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState } = useForm({
    mode: 'onBlur'
  });
  const history = useHistory();
  const { loginWithEmailAndPassword } = useContext(AuthContext);
  const client = useApolloClient();

  const hasPassword = Boolean(watch('password'));

  const getUserEmail = async (input) => {
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables: {
        input: input
      }
    });

    console.log(response.data);
    return response.data.users[0]?.email || 'no@email.com';
  };

  const errorHandler = (error) => {
    if (error?.message?.includes('auth')) {
      setError(error.message);
    }
  };

  const onSubmit = async ({ input, password }) => {
    try {
      setError('');
      if (!isEmail(input)) {
        input = await getUserEmail(input);
      }
      await loginWithEmailAndPassword(input, password);
      setTimeout(() => {
        history.push('/');
      }, 0);
    } catch (error) {
      console.error('Error logging in', error);
      errorHandler(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <SEO title='Login' />
      <section className={styles.section}>
        <article>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('input', {
                  required: true,
                  minLength: 5
                })}
                fullWidth
                variant='filled'
                label='Phone number, username or email'
                margin='dense'
                className={styles.textField}
                autoComplete='username'
                name='input'
              />
              <TextField
                {...register('password', {
                  required: true,
                  minLength: 5
                })}
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment>
                      <Button onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputAdornment>
                  )
                }}
                fullWidth
                variant='filled'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                margin='dense'
                className={styles.textField}
                autoComplete='current-password'
                name='password'
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant='contained'
                fullWidth
                color='primary'
                style={{ margin: '8px 0' }}
                type='submit'
              >
                Log In
              </Button>
            </form>
            <div className={styles.orContainer}>
              <div className={styles.orLine} />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Or
                </Typography>
              </div>
              <div className={styles.orLine} />
            </div>
            <LoginWithFacebook color='secondary' iconColor='blue' />
            <AuthError error={error} />
            <Button fullWidth color='secondary'>
              <Typography variant='caption'>Forgot password</Typography>
            </Button>
          </Card>
          <Card className={styles.signUpCard}>
            <Typography align='right' variant='body2'>
              Don't have an account?
            </Typography>
            <Link to='/accounts/emailsignup'>
              <Button color='primary' className={styles.signUpButton}>
                Sign Up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export const LoginWithFacebook = ({ color, iconColor, variant }) => {
  const styles = useLoginPageStyles();
  const history = useHistory();
  const { logInWithGoogle } = useContext(AuthContext);

  const [error, setError] = useState('');

  const loginWithGoogleHandler = async () => {
    try {
      await logInWithGoogle();
      setTimeout(history.push('/'), 0);
    } catch (error) {
      console.error('Error logging in with Gogle', error);
      setError(error.message);
    }
  };
  const facebookIcon =
    iconColor === 'blue' ? FaceBookIconBlue : FaceBookIconWhite;

  return (
    <>
      <Button
        fullWidth
        color={color}
        variant={variant}
        onClick={loginWithGoogleHandler}
      >
        <img
          src={facebookIcon}
          alt='facebook icon'
          className={styles.facebookIcon}
        />
        Log In With Facebook
      </Button>
      <AuthError error={error} />
    </>
  );
};

export default LoginPage;

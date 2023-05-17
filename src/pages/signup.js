import React, { useContext } from 'react';
import { useSignUpPageStyles } from '../styles';
import { LoginWithFacebook } from './login';
import SEO from '../components/shared/Seo';
import {
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons';
import { useApolloClient } from '@apollo/client';
import { CHECK_IF_USERNAME_IS_TAKEN } from '../graphql/queries';

function SignUpPage() {
  const styles = useSignUpPageStyles();
  const { register, handleSubmit, formState } = useForm({ mode: 'onBlur' });
  const history = useHistory();
  const { signUpWithEmailAndPassword } = useContext(AuthContext);
  const [error, setError] = React.useState('');
  const client = useApolloClient();

  const errorHandler = () => {
    if (error?.message?.includes('users_username_key')) {
      return 'Username already taken';
    } else if (error?.message?.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters';
    }
    return error.message;
  };

  const errorIcon = (
    <InputAdornment>
      <HighlightOff style={{ color: 'red', height: 30, width: 30 }} />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline style={{ color: '#ccc', height: 30, width: 30 }} />
    </InputAdornment>
  );

  const onSubmit = async (data) => {
    setError('');
    try {
      await signUpWithEmailAndPassword(data);
      history.push('/');
    } catch (error) {
      console.error('Error signing up', error);
      setError(error);
    }
  };

  const validateUsername = async (username) => {
    const variables = { username };
    const response = await client.query({
      query: CHECK_IF_USERNAME_IS_TAKEN,
      variables: variables
    });
    const isUsernameValid = response.data.users.length === 0;
    return isUsernameValid;
  };
  return (
    <>
      <SEO title='Sign up' />
      <section className={styles.section}>
        <article>
          <Card className={styles.card}>
            <div className={styles.cardHeader} />
            <Typography className={styles.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook
              color='primary'
              iconColor='white'
              variant='contained'
            />
            <div className={styles.orContainer}>
              <div className={styles.orLine} />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Or
                </Typography>
              </div>
              <div className={styles.orLine} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email', {
                  required: true,
                  validate: (input) => isEmail(input)
                })}
                InputProps={{
                  endAdornment: formState.errors.email
                    ? errorIcon
                    : formState.touchedFields.email && validIcon
                }}
                fullWidth
                variant='filled'
                label='Email'
                type='email'
                margin='dense'
                className={styles.textField}
                name='email'
              />
              <TextField
                fullWidth
                {...register('name', {
                  required: true,
                  minLength: 5,
                  maxLength: 20
                })}
                InputProps={{
                  endAdornment: formState.errors?.name
                    ? errorIcon
                    : formState.touchedFields.name && validIcon
                }}
                variant='filled'
                label='Full Name'
                margin='dense'
                className={styles.textField}
                name='name'
              />
              <TextField
                fullWidth
                {...register('username', {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  pattern: /^[a-zA-z0-9_.]*$/,
                  validate: async (input) => await validateUsername(input)
                })}
                InputProps={{
                  endAdornment: formState.errors?.username
                    ? errorIcon
                    : formState.touchedFields.username && validIcon
                }}
                variant='filled'
                label='Username'
                margin='dense'
                className={styles.textField}
                autoComplete='username'
                name='username'
              />
              <TextField
                fullWidth
                {...register('password', {
                  required: true,
                  minLength: 5
                })}
                InputProps={{
                  endAdornment: formState.errors?.password
                    ? errorIcon
                    : formState.touchedFields.password && validIcon
                }}
                variant='filled'
                label='Password'
                margin='dense'
                type='password'
                className={styles.textField}
                autcomplete='new-password'
                name='password'
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant='contained'
                fullWidth
                color='primary'
                style={{ margin: '10px 0px 16px 0px' }}
                type='submit'
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={errorHandler(error)} />
          </Card>
          <Card className={styles.loginCard}>
            <Typography align='right' variant='body2'>
              Have an account?
            </Typography>
            <Link to='/accounts/login'>
              <Button color='primary' className={styles.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export const AuthError = ({ error }) => {
  return (
    Boolean(error) && (
      <Typography
        align='center'
        gutterBottom
        variant='body2'
        style={{ color: 'red' }}
      >
        {error}
      </Typography>
    )
  );
};

export default SignUpPage;

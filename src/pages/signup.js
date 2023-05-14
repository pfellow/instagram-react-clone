import React from 'react';
import { useSignUpPageStyles } from '../styles';
import { LoginWithFacebook } from './login';
import SEO from '../components/shared/Seo';
import { Card, Typography, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom/cjs/react-router-dom';

function SignUpPage() {
  const styles = useSignUpPageStyles();

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

            <form>
              <TextField
                fullWidth
                variant='filled'
                label='Email'
                type='email'
                margin='dense'
                className={styles.textField}
              />
              <TextField
                fullWidth
                variant='filled'
                label='Full Name'
                margin='dense'
                clas
                sName={styles.textField}
              />
              <TextField
                fullWidth
                variant='filled'
                label='Username'
                margin='dense'
                className={styles.textField}
                autoComplete='username'
              />
              <TextField
                fullWidth
                variant='filled'
                label='Password'
                margin='dense'
                type='password'
                className={styles.textField}
                autcomplete='new-password'
              />
              <Button
                variant='contained'
                fullWidth
                color='primary'
                style={{ margin: '10px 0px 16px 0px' }}
                type='submit'
              >
                Sign Up
              </Button>
            </form>
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

export default SignUpPage;

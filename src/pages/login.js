import React from 'react';
import { useLoginPageStyles } from '../styles';
import SEO from '../components/shared/Seo';
import {
  Button,
  Card,
  CardHeader,
  TextField,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import FaceBookIconBlue from '../images/facebook-icon-blue.svg';
import FaceBookIconWhite from '../images/facebook-icon-white.png';

function LoginPage() {
  const styles = useLoginPageStyles();

  return (
    <>
      <SEO title='Login' />
      <section className={styles.section}>
        <article>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader} />
            <form>
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
                type='password'
                margin='dense'
                className={styles.textField}
                autoComplete='current-password'
              />
              <Button
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
  const facebookIcon =
    iconColor === 'blue' ? FaceBookIconBlue : FaceBookIconWhite;

  return (
    <Button fullWidth color={color} variant={variant}>
      <img
        src={facebookIcon}
        alt='facebook icon'
        className={styles.facebookIcon}
      />
      Log In With Facebook
    </Button>
  );
};

export default LoginPage;

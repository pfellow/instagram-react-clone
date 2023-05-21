import React, { useContext, useState } from 'react';
import { useEditProfilePageStyles } from '../styles';
import Layout from '../components/shared/Layout';
import {
  Button,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import ProfilePicture from '../components/shared/ProfilePicture';
import { UserContext } from '../App';
import { useMutation, useQuery } from '@apollo/client';
import { GET_EDIT_USER_PROFILE } from '../graphql/queries';
import LoadingScreen from '../components/shared/LoadingScreen';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { EDIT_USER, EDIT_USER_AVATAR } from '../graphql/mutations';
import { AuthContext } from '../auth';
import handleImageUpload from '../utils/handleImageUpload';

function EditProfilePage({ history }) {
  const { currentUserId } = useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, {
    variables: variables
  });
  const styles = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = useState(false);

  if (loading) return <LoadingScreen />;

  const toggleDrawerHandler = () => {
    setDrawer((prev) => !prev);
  };

  const listClickHandler = (index) => {
    switch (index) {
      case 0:
        history.push('/accounts/edit');
        break;
      default:
        break;
    }
  };

  const selectedHandler = (index) => {
    switch (index) {
      case 0:
        return history.location.pathname.includes('edit');
      default:
        break;
    }
  };

  const options = [
    'Edit Profile',
    'Change Password',
    'Apps and Websites',
    'Email and SMS',
    'Push Notifications',
    'Manage Contacts',
    'Privacy and Security',
    'Login Activity',
    'Emails from Instagram'
  ];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={selectedHandler(index)}
          onClick={() => listClickHandler(index)}
          classes={{
            selected: styles.listItemSelected,
            button: styles.listItemButton
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Layout title='Edit Profile'>
      <section className={styles.section}>
        <IconButton
          edge='start'
          onClick={toggleDrawerHandler}
          className={styles.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation='css'>
            <Drawer
              variant='temporary'
              anchor='left'
              open={showDrawer}
              onClose={toggleDrawerHandler}
              classes={{
                paperAnchorLeft: styles.temporaryDrawer
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation='css'
            className={styles.permanentDrawerRoot}
          >
            <Drawer
              variant='permanent'
              open
              classes={{
                paper: styles.permanentDrawerPaper,
                root: styles.permanentDrawerRoot
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {history.location.pathname.includes('edit') && (
            <EditUserInfo user={data.users_by_pk} />
          )}
        </main>
      </section>
    </Layout>
  );
}

const DEFAULT_ERROR = { type: '', message: '' };

const EditUserInfo = ({ user }) => {
  const styles = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: 'onBlur' });
  const { updateEmail } = useContext(AuthContext);
  const [editUser] = useMutation(EDIT_USER);
  const [error, setError] = useState(DEFAULT_ERROR);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profile_image);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);

  const errorHandler = (err) => {
    console.log('Error: ', err.message);
    if (err.message.includes('users_username_key')) {
      setError({ type: 'username', message: 'This username already taken' });
    } else if (err.message.includes('auth')) {
      setError({ type: 'email', message: err.message });
    }
    console.log(error);
  };

  const onSubmit = async (data) => {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
    } catch (error) {
      errorHandler(error);
    }
    setOpen(true);
  };

  const handleUpdateProfilePic = async (e) => {
    const url = await handleImageUpload(e.target.files[0], 'instagram_avatar');
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  };

  return (
    <section className={styles.container}>
      <div className={styles.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={styles.justifySelfStart}>
          <Typography className={styles.typography}>{user.username}</Typography>
          <input
            accept='image/*'
            id='image'
            type='file'
            style={{ display: 'none' }}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor='image'>
            <Typography
              color='primary'
              variant='body2'
              className={styles.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <SectionItem
          text='Name'
          formItem={user.name}
          name='name'
          valdata={{
            ...register('name', {
              required: true,
              minLength: 5,
              maxLength: 20
            })
          }}
        />
        <SectionItem
          error={error}
          text='Username'
          formItem={user.username}
          name='username'
          valdata={{
            ...register('username', {
              required: true,
              pattern: /^[a-zA-Z0-9_.]*$/,
              minLength: 5,
              maxLength: 50
            })
          }}
        />
        <SectionItem
          text='Website'
          formItem={user.website}
          name='website'
          valdata={{
            ...register('website', {
              validate: (input) =>
                Boolean(input)
                  ? isURL(input, {
                      protocols: ['http', 'https'],
                      require_protocol: true
                    })
                  : true
            })
          }}
        />
        <div className={styles.sectionItem}>
          <aside>
            <Typography className={styles.bio}>Bio</Typography>
          </aside>
          <TextField
            variant='outlined'
            name='bio'
            {...register('bio', {
              maxLength: 120
            })}
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            defaultValue={user.bio}
          />
        </div>
        <div className={styles.sectionItem}>
          <div />
          <Typography color='textSecondary' className={styles.justifySelfStart}>
            Personal Information
          </Typography>
        </div>
        <SectionItem
          error={error}
          text='Email'
          formItem={user.email}
          type='email'
          name='email'
          valdata={{
            ...register('email', {
              required: true,
              validate: (input) => isEmail(input)
            })
          }}
        />
        <SectionItem
          text='Phone Number'
          formItem={user.phone_number}
          name='phoneNumber'
          valdata={{
            ...register('phoneNumber', {
              validate: (input) =>
                Boolean(input) ? isMobilePhone(input) : true
            })
          }}
        />
        <div className={styles.sectionItem}>
          <div />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={styles.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        message={<span>Profile updated</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  );
};

const SectionItem = ({
  type = 'text',
  text,
  formItem,
  valdata,
  name,
  error
}) => {
  const styles = useEditProfilePageStyles();

  return (
    <div className={styles.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={styles.typography} align='right'>
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={styles.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        {...valdata}
        helperText={error?.type === name && error.message}
        variant='outlined'
        fullWidth
        defaultValue={formItem}
        type={type}
        className={styles.textField}
        inputProps={{
          className: styles.textFieldInput
        }}
      />
    </div>
  );
};

export default EditProfilePage;

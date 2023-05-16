import React, { useState } from 'react';
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
  TextField,
  Typography
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { defaultCurrentUser } from '../data';
import ProfilePicture from '../components/shared/ProfilePicture';

function EditProfilePage({ history }) {
  const styles = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = useState(false);

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
              variant='temorary'
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
            <EditUserInfo user={defaultCurrentUser} />
          )}
        </main>
      </section>
    </Layout>
  );
}

const EditUserInfo = ({ user }) => {
  const styles = useEditProfilePageStyles();

  return (
    <section className={styles.container}>
      <div className={styles.pictureSectionItem}>
        <ProfilePicture size={38} user={user} />
        <div className={styles.justifySelfStart}>
          <Typography className={styles.typography}>{user.username}</Typography>
          <Typography
            color='primary'
            variant='body2'
            className={styles.typographyChangePic}
          >
            Change Profile Photo
          </Typography>
        </div>
      </div>
      <form className={styles.form}>
        <SectionItem text='Name' formItem={user.name} />
        <SectionItem text='Username' formItem={user.username} />
        <SectionItem text='Website' formItem={user.website} />
        <div className={styles.sectionItem}>
          <aside>
            <Typography className={styles.bio}>Bio</Typography>
          </aside>
          <TextField
            variant='outlined'
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            value={user.bio}
          />
        </div>
        <div className={styles.sectionItem}>
          <div />
          <Typography color='textSecondary' className={styles.justifySelfStart}>
            Personal Information
          </Typography>
        </div>
        <SectionItem text='Email' formItem={user.email} type='email' />
        <SectionItem text='Phone Number' formItem={user.phone_number} />
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
    </section>
  );
};

const SectionItem = ({ type = 'text', text, formItem }) => {
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
        variant='outlined'
        fullWidth
        value={formItem}
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

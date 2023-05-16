import React, { useState } from 'react';
import { useProfilePageStyles } from '../styles';
import Layout from '../components/shared/Layout';
import { defaultCurrentUser } from '../data';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Divider,
  Hidden,
  Typography,
  Zoom
} from '@material-ui/core';
import ProfilePicture from '../components/shared/ProfilePicture';
import ProfileTabs from '../components/profile/ProfileTabs';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { GearIcon } from '../icons';

function ProfilePage() {
  const [showOptionsMenu, setOptionsMenu] = useState(false);
  const styles = useProfilePageStyles();
  const isOwner = true;

  const optionsMenuClickHandler = () => {
    setOptionsMenu(true);
  };

  const closeMenuHandler = () => {
    setOptionsMenu(false);
  };

  return (
    <Layout
      title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}
    >
      <div className={styles.container}>
        <Hidden xsDown>
          <Card className={styles.cardLarge}>
            <ProfilePicture isOwner={isOwner} />
            <CardContent className={styles.cardContentLarge}>
              <ProfileNameSection
                user={defaultCurrentUser}
                isOwner={isOwner}
                optionsMenuClickHandler={optionsMenuClickHandler}
              />
              <PostCountSection user={defaultCurrentUser} />
              <NameBioSection user={defaultCurrentUser} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={styles.cardSmall}>
            <CardContent>
              <section className={styles.sectionSmall}>
                <ProfilePicture size={77} isOwner={isOwner} />
                <ProfileNameSection
                  user={defaultCurrentUser}
                  isOwner={isOwner}
                  optionsMenuClickHandler={optionsMenuClickHandler}
                />
              </section>
              <NameBioSection user={defaultCurrentUser} />
            </CardContent>
            <PostCountSection user={defaultCurrentUser} />
          </Card>
        </Hidden>
        {showOptionsMenu && <OptionsMenu closeMenuHandler={closeMenuHandler} />}
        <ProfileTabs user={defaultCurrentUser} isOwner={isOwner} />
      </div>
    </Layout>
  );
}

const ProfileNameSection = ({ user, isOwner, optionsMenuClickHandler }) => {
  const styles = useProfilePageStyles();
  const [showUnfollowDialog, setUnfollowDialog] = useState(false);

  let followButton;
  const isFollowing = true;
  const isFollower = false;

  if (isFollowing) {
    followButton = (
      <Button
        variant='outlined'
        className={styles.button}
        onClick={() => setUnfollowDialog(true)}
      >
        Following
      </Button>
    );
  } else if (isFollower) {
    <Button variant='contained' color='primary' className={styles.button}>
      Follow Back
    </Button>;
  } else {
    <Button
      variant='contained'
      color='primary'
      className={styles.button}
      Follow
    >
      Follow
    </Button>;
  }

  return (
    <>
      <Hidden xsDown>
        <section className={styles.usernameSection}>
          <Typography className={styles.username}>{user.username}</Typography>
          {isOwner ? (
            <>
              <Link to='/account/edit'>
                <Button variant='outlined'>Edit Profile</Button>
              </Link>
              <div
                onClick={optionsMenuClickHandler}
                className={styles.settingWrapper}
              >
                <GearIcon className={styles.settings} />
              </div>
            </>
          ) : (
            <>{followButton}</>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={styles.usernameDivSmall}>
            <Typography className={styles.username}>{user.username}</Typography>
            {isOwner && (
              <div
                onClick={optionsMenuClickHandler}
                className={styles.settingWrapper}
              >
                <GearIcon className={styles.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to='/account/edit'>
              <Button variant='outlined' style={{ width: '100%' }}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            followButton
          )}
        </section>
      </Hidden>
      {showUnfollowDialog && (
        <UnfollowDialog onClose={() => setUnfollowDialog(false)} user={user} />
      )}
    </>
  );
};

const UnfollowDialog = ({ onClose, user }) => {
  const styles = useProfilePageStyles();
  return (
    <Dialog
      open
      classes={{ scrollPaper: styles.unfollowDialogScrollPaper }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={styles.wrapper}>
        <Avatar
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          className={styles.avatar}
        />
      </div>
      <Typography
        align='center'
        variant='body2'
        className={styles.unfollowDialogText}
      >
        Unfollow @{user.username}?
      </Typography>
      <Divider />
      <Button className={styles.unfollowButton}>Unfollow</Button>
      <Divider />
      <Button className={styles.cancelButton} onClick={onClose}>
        Cancel
      </Button>
    </Dialog>
  );
};

const PostCountSection = ({ user }) => {
  const styles = useProfilePageStyles();
  const options = ['posts', 'followers', 'following'];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={styles.followingSection}>
        {options.map((option) => (
          <div key={option} className={styles.followingText}>
            <Typography className={styles.followingCount}>
              {user[option].length}
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color='textSecondary'>{option}</Typography>
            </Hidden>
          </div>
        ))}
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  );
};

const NameBioSection = ({ user }) => {
  const styles = useProfilePageStyles();

  return (
    <section className={styles.section}>
      <Typography className={styles.typography}>{user.name}</Typography>
      <Typography>{user.bio}</Typography>
      <a href={user.website} target='_blank' rel='noopener noreferrer'>
        <Typography color='secondary' className={styles.typography}>
          {user.website}
        </Typography>
      </a>
    </section>
  );
};

const OptionsMenu = ({ closeMenuHandler }) => {
  const styles = useProfilePageStyles();

  const [showLogOutMessage, setLogoutMessage] = useState(false);

  const logOutClickHandler = () => {
    setLogoutMessage(true);
  };

  return (
    <Dialog
      open
      classes={{
        scrollPaper: styles.dialogScrollPaper
      }}
      TransitionComponent={Zoom}
    >
      {' '}
      {showLogOutMessage ? (
        <DialogTitle className={styles.dialogTitle}>
          Logging Out
          <Typography color='textSecondary'>
            You need to log back in to continue using Instagram.
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsItem text='Change Password' />
          <OptionsItem text='Nametag' />
          <OptionsItem text='Authorized Apps' />
          <OptionsItem text='Notification' />
          <OptionsItem text='Privacy and Security' />
          <OptionsItem text='Log Out' onClick={logOutClickHandler} />
          <OptionsItem text='Cancel' onClick={closeMenuHandler} />
        </>
      )}
    </Dialog>
  );
};

const OptionsItem = ({ text, onClick }) => {
  return (
    <>
      <Button style={{ padding: '20px 8px' }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  );
};

export default ProfilePage;

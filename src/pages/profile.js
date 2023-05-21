import React, { useContext, useState } from 'react';
import { useProfilePageStyles } from '../styles';
import Layout from '../components/shared/Layout';
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
import { Link, useHistory, useParams } from 'react-router-dom';
import { GearIcon } from '../icons';
import { AuthContext } from '../auth';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries';
import LoadingScreen from '../components/shared/LoadingScreen';
import { UserContext } from '../App';
import { FOLLOW_USER, UNFOLLOW_USER } from '../graphql/mutations';

function ProfilePage() {
  const { currentUserId } = useContext(UserContext);
  const { username } = useParams();
  const [showOptionsMenu, setOptionsMenu] = useState(false);
  const styles = useProfilePageStyles();
  const history = useHistory();

  const variables = { username };
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables,
    fetchPolicy: 'no-cache'
  });

  if (loading) return <LoadingScreen />;

  const [user] = data.users;

  if (!user) {
    history.push('/not/Found');
    return null;
  }

  const isOwner = user?.id === currentUserId;

  const optionsMenuClickHandler = () => {
    setOptionsMenu(true);
  };

  const closeMenuHandler = () => {
    setOptionsMenu(false);
  };

  return (
    <Layout title={`${user.name} (@${user.username})`}>
      <div className={styles.container}>
        <Hidden xsDown>
          <Card className={styles.cardLarge}>
            <ProfilePicture isOwner={isOwner} image={user.profile_image} />
            <CardContent className={styles.cardContentLarge}>
              <ProfileNameSection
                user={user}
                isOwner={isOwner}
                optionsMenuClickHandler={optionsMenuClickHandler}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={styles.cardSmall}>
            <CardContent>
              <section className={styles.sectionSmall}>
                <ProfilePicture
                  size={77}
                  isOwner={isOwner}
                  image={user.profile_image}
                />
                <ProfileNameSection
                  user={user}
                  isOwner={isOwner}
                  optionsMenuClickHandler={optionsMenuClickHandler}
                />
              </section>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card>
        </Hidden>
        {showOptionsMenu && <OptionsMenu closeMenuHandler={closeMenuHandler} />}
        <ProfileTabs user={user} isOwner={isOwner} />
      </div>
    </Layout>
  );
}

const ProfileNameSection = ({ user, isOwner, optionsMenuClickHandler }) => {
  const styles = useProfilePageStyles();
  const [showUnfollowDialog, setUnfollowDialog] = useState(false);
  const { currentUserId, followingIds, followerIds } = useContext(UserContext);
  const isAlreadyFollowing = followingIds.some((id) => id === user.id);
  const [isFollowing, setFollowing] = useState(isAlreadyFollowing);
  const isFollower = !isFollowing && followerIds.some((id) => id === user.id);
  const variables = {
    userIdToFollow: user.id,
    currentUserId
  };
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const followUserHandler = () => {
    setFollowing(true);
    followUser({ variables });
  };

  const unfollowUserHandler = () => {
    setFollowing(false);
    unfollowUser({ variables });
  };

  let followButton;
  // const isFollowing = true;
  // const isFollower = false;

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
    followButton = (
      <Button
        onClick={followUserHandler}
        variant='contained'
        color='primary'
        className={styles.button}
      >
        Follow Back
      </Button>
    );
  } else {
    followButton = (
      <Button
        onClick={followUserHandler}
        variant='contained'
        color='primary'
        className={styles.button}
        Follow
      >
        Follow
      </Button>
    );
  }

  return (
    <>
      <Hidden xsDown>
        <section className={styles.usernameSection}>
          <Typography className={styles.username}>{user.username}</Typography>
          {isOwner ? (
            <>
              <Link to='/accounts/edit'>
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
        <UnfollowDialog
          onClose={() => setUnfollowDialog(false)}
          user={user}
          unfollowUserHandler={unfollowUserHandler}
        />
      )}
    </>
  );
};

const UnfollowDialog = ({ onClose, user, unfollowUserHandler }) => {
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
      <Button
        className={styles.unfollowButton}
        onClick={() => {
          unfollowUserHandler();
          onClose();
        }}
      >
        Unfollow
      </Button>
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
              {user[`${option}_aggregate`].aggregate.count}
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
  const { signOut } = useContext(AuthContext);
  const history = useHistory();
  const client = useApolloClient();

  const [showLogOutMessage, setLogoutMessage] = useState(false);

  const logOutClickHandler = () => {
    setLogoutMessage(true);
    setTimeout(async () => {
      await client.clearStore();
      signOut();
      history.push('/accounts/login');
    }, 2000);
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

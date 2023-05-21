import React, { useContext } from 'react';
import { useFollowButtonStyles } from '../../styles';
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { UserContext } from '../../App';
import { useMutation } from '@apollo/client';
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations';

function FollowButton({ side, id }) {
  const styles = useFollowButtonStyles({ side });
  const { currentUserId, followingIds } = useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(
    (followindId) => followindId === id
  );
  const [isFollowing, setFollowing] = useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const variables = {
    userIdToFollow: id,
    currentUserId
  };

  const followUserHandler = () => {
    setFollowing(true);
    followUser({ variables });
  };

  const unfollowUserHandler = () => {
    setFollowing(false);
    unfollowUser({ variables });
  };

  const followButton = (
    <Button
      variant={side ? 'text' : 'contained'}
      color='primary'
      className={styles.button}
      onClick={followUserHandler}
      fullWidth
    >
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? 'text' : 'outlined'}
      className={styles.button}
      onClick={unfollowUserHandler}
      fullWidth
    >
      Following
    </Button>
  );

  return isFollowing ? followingButton : followButton;
}

export default FollowButton;

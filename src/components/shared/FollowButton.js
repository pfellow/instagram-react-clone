import React from 'react';
import { useFollowButtonStyles } from '../../styles';
import { useState } from 'react';
import { Button } from '@material-ui/core';

function FollowButton({ side }) {
  const styles = useFollowButtonStyles({ side });
  const [isFollowing, setFollowing] = useState(false);

  const followButton = (
    <Button
      variant={side ? 'text' : 'contained'}
      color='primary'
      className={styles.button}
      onClick={() => setFollowing(true)}
      fullWidth
    >
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? 'text' : 'outlined'}
      className={styles.button}
      onClick={() => setFollowing(false)}
      fullWidth
    >
      Following
    </Button>
  );

  return isFollowing ? followingButton : followButton;
}

export default FollowButton;

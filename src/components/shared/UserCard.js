import React from 'react';
import { useUserCardStyles } from '../../styles';
import { Link } from 'react-router-dom';
import { Avatar, Typography } from '@material-ui/core';
import { defaultUser } from '../../data';

function UserCard({ user = defaultUser, avatarSize = 44, location }) {
  const styles = useUserCardStyles({ avatarSize });
  const { username, profile_image, name } = user;

  return (
    <div className={styles.wrapper}>
      <Link to={`/${username}`}>
        <Avatar
          src={profile_image}
          alt='User avatar'
          className={styles.avatar}
        />
      </Link>
      <div className={styles.nameWrapper}>
        <Link to={`/${username}`}>
          <Typography variant='subtitle2' className={styles.typography}>
            {username}
          </Typography>
        </Link>
        <Typography
          color='textSecondary'
          variant='body2'
          className={styles.typography}
        >
          {location || name}
        </Typography>
      </div>
    </div>
  );
}

export default UserCard;

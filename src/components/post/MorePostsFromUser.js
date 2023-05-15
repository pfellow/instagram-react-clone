import React from 'react';
import { useMorePostsFromUserStyles } from '../../styles';
import { Typography } from '@material-ui/core';
import { LoadingLargeIcon } from '../../icons';
import { getDefaultPost, defaultUser } from '../../data';
import GridPost from '../shared/GridPost';
import { Link } from 'react-router-dom';

function MorePostsFromUser() {
  const styles = useMorePostsFromUserStyles();

  let loading = false;

  return (
    <div className={styles.container}>
      <Typography
        color='textSecondary'
        variant='subtitle2'
        component='h2'
        gutterBottom
        className={styles.typography}
      >
        More Posts from{' '}
        <Link to={`/${defaultUser.username}`} className={styles.link}>
          @{defaultUser.username}
        </Link>
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={styles.article}>
          <div className={styles.postContainer}>
            {Array.from({ length: 6 }, () => getDefaultPost()).map((post) => (
              <GridPost post={post} key={post.id} />
            ))}
          </div>
        </article>
      )}
    </div>
  );
}

export default MorePostsFromUser;

import React from 'react';
import { useExploreGridStyles } from '../../styles';
import { Typography } from '@material-ui/core';
import { LoadingLargeIcon } from '../../icons';
import { getDefaultPost } from '../../data';
import GridPost from '../shared/GridPost';

function ExploreGrid() {
  const styles = useExploreGridStyles();

  let loading = false;

  return (
    <>
      <Typography
        color='textSecondary'
        variant='subtitle2'
        component='h2'
        gutterBottom
        className={styles.typography}
      >
        Explore
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={styles.article}>
          <div className={styles.postContainer}>
            {Array.from({ length: 20 }, () => getDefaultPost()).map((post) => (
              <GridPost post={post} key={post.id} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

export default ExploreGrid;

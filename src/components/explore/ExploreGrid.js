import React, { useContext } from 'react';
import { useExploreGridStyles } from '../../styles';
import { Typography } from '@material-ui/core';
import { LoadingLargeIcon } from '../../icons';
import GridPost from '../shared/GridPost';
import { useQuery } from '@apollo/client';
import { EXPLORE_POSTS } from '../../graphql/queries';
import { UserContext } from '../../App';

function ExploreGrid() {
  const styles = useExploreGridStyles();
  const { feedIds } = useContext(UserContext);
  const variables = { feedIds };
  const { data, loading } = useQuery(EXPLORE_POSTS, { variables });

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
            {data.posts.map((post) => (
              <GridPost post={post} key={post.id} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

export default ExploreGrid;

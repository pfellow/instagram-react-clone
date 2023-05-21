import React, { useEffect } from 'react';
import { useMorePostsFromUserStyles } from '../../styles';
import { Typography } from '@material-ui/core';
import { LoadingLargeIcon } from '../../icons';
import GridPost from '../shared/GridPost';
import { Link } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_MORE_POSTS_FROM_USER, GET_POST } from '../../graphql/queries';

function MorePostsFromUser({ postId }) {
  const styles = useMorePostsFromUserStyles();
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  const [getMorePostsFromUser, { data: morePosts, loading: loading2 }] =
    useLazyQuery(GET_MORE_POSTS_FROM_USER);

  useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={styles.container}>
      {loading || loading2 ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color='textSecondary'
            variant='subtitle2'
            component='h2'
            gutterBottom
            className={styles.typography}
          >
            More Posts from{' '}
            <Link
              to={`/${data.posts_by_pk.user.username}`}
              className={styles.link}
            >
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>

          <article className={styles.article}>
            <div className={styles.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost post={post} key={post.id} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default MorePostsFromUser;

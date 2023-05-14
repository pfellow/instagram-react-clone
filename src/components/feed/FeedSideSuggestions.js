import React from 'react';
import { useFeedSideSuggestionsStyles } from '../../styles';
import { Paper, Typography } from '@material-ui/core';
import { getDefaultUser } from '../../data';
import UserCard from '../shared/UserCard';
import FollowButton from '../shared/FollowButton';
import { LoadingIcon } from '../../icons';

function FeedSideSuggestions() {
  const styles = useFeedSideSuggestionsStyles();

  let loading = false;

  return (
    <article className={styles.article}>
      <Paper className={styles.paper}>
        <Typography
          variant='subtitle2'
          color='textSecondary'
          component='h2'
          align='center'
          gutterBottom
          className={styles.typography}
        >
          Suggestions For You
        </Typography>
        {loading ? (
          <LoadingIcon />
        ) : (
          Array.from({ length: 5 }, () => getDefaultUser()).map((user) => (
            <div key={user.id} className={styles.card}>
              <UserCard user={user} />
              <FollowButton side />
            </div>
          ))
        )}
      </Paper>
    </article>
  );
}

export default FeedSideSuggestions;

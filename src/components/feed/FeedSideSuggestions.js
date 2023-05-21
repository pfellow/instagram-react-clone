import React, { useContext } from 'react';
import { useFeedSideSuggestionsStyles } from '../../styles';
import { Paper, Typography } from '@material-ui/core';
import UserCard from '../shared/UserCard';
import FollowButton from '../shared/FollowButton';
import { LoadingIcon } from '../../icons';
import { useQuery } from '@apollo/client';
import { SUGGEST_USERS } from '../../graphql/queries';
import { UserContext } from '../../App';

function FeedSideSuggestions() {
  const styles = useFeedSideSuggestionsStyles();
  const { me, followerIds } = useContext(UserContext);
  const variables = { limit: 5, followerIds, createdAt: me.created_at };
  const { data, loading } = useQuery(SUGGEST_USERS, { variables });

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
          data.users.map((user) => (
            <div key={user.id} className={styles.card}>
              <UserCard user={user} />
              <FollowButton id={user.id} side />
            </div>
          ))
        )}
      </Paper>
    </article>
  );
}

export default FeedSideSuggestions;

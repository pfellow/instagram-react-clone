import React from 'react';
import { useGridPostStyles } from '../../styles';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

function GridPost({ post }) {
  const history = useHistory();
  const styles = useGridPostStyles();

  const openPostModalHandler = () => {
    history.push({
      pathname: `/p/${post.id}`,
      state: { modal: true, prevLocation: history.location.pathname }
    });
  };

  const commentsCount = post.comments_aggregate.aggregate.count;
  const likesCount = post.likes_aggregate.aggregate.count;

  return (
    <div className={styles.gridPostContainer} onClick={openPostModalHandler}>
      <div className={styles.gridPostOverlay}>
        <div className={styles.gridPostInfo}>
          <span className={styles.likes} />
          <Typography>{likesCount}</Typography>
        </div>
        <div className={styles.gridPostInfo}>
          <span className={styles.comments} />
          <Typography>{commentsCount}</Typography>
        </div>
      </div>
      <img src={post.media} alt='Post cover' className={styles.image} />
    </div>
  );
}

export default GridPost;

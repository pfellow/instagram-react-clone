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

  return (
    <div className={styles.gridPostContainer} onClick={openPostModalHandler}>
      <div className={styles.gridPostOverlay}>
        <div className={styles.gridPostInfo}>
          <span className={styles.likes} />
          <Typography>{post.likes}</Typography>
        </div>
        <div className={styles.gridPostInfo}>
          <span className={styles.comments} />
          <Typography>{post.comments.length}</Typography>
        </div>
      </div>
      <img src={post.media} alt='Post cover' className={styles.image} />
    </div>
  );
}

export default GridPost;

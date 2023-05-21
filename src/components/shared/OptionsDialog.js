import React, { useContext } from 'react';
import { useOptionsDialogStyles } from '../../styles';
import { Button, Dialog, Divider, Zoom } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { useMutation } from '@apollo/client';
import { DELETE_POST, UNFOLLOW_USER } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';

function OptionsDialog({ onClose, postId, authorId }) {
  const styles = useOptionsDialogStyles();
  const { currentUserId, followingIds } = useContext(UserContext);
  const isOwner = authorId === currentUserId;
  const buttonText = isOwner ? 'Delete' : 'Unfollow';
  const isFollowing = followingIds.some((id) => id === authorId);
  const isUnrelatedUser = !isOwner && !isFollowing;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const history = useHistory();

  const deletePostHandler = () => {
    const variables = {
      postId,
      userId: currentUserId
    };
    deletePost({ variables });
    onClose();
    history.push('/');
    window.location.reload();
  };

  const unfollowUserHandler = () => {
    const variables = {
      userIdToFollow: authorId,
      currentUserId
    };
    unfollowUser({ variables });
    onClose();
  };

  const onClick = isOwner ? deletePostHandler : unfollowUserHandler;

  return (
    <Dialog
      open
      classes={{
        scrollPaper: styles.dialogScrollPaper
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      {!isUnrelatedUser && (
        <Button className={styles.redButton} onClick={onClick}>
          {buttonText}
        </Button>
      )}
      <Divider />
      <Button className={styles.button}>
        <Link to={`/p/${postId}`}>Go to post</Link>
      </Button>
      <Divider />
      <Button className={styles.button}>Share</Button>
      <Divider />
      <Button className={styles.button}>Copy Link</Button>
      <Divider />
      <Button onClick={onClose} className={styles.button}>
        Cancel
      </Button>
    </Dialog>
  );
}

export default OptionsDialog;

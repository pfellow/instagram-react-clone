import React from 'react';
import { usePostModalStyles } from '../../styles';
import Modal from 'react-modal';
import { useHistory, useParams } from 'react-router-dom';
import { CloseIcon } from '../../icons';
import Post from './Post';

function PostModal() {
  const history = useHistory();
  const { postId } = useParams();
  const styles = usePostModalStyles();

  return (
    <>
      <Modal
        isOpen
        ariaHideApp={false}
        overlayClassName={styles.overlay}
        onRequestClose={() => history.goBack()}
        style={{
          content: {
            display: 'flex',
            alignItems: 'center',
            maxWidth: 935,
            width: '100%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            padding: 0,
            overflow: 'none',
            WebkitOverflowScrolling: 'touch'
          }
        }}
      >
        <Post postId={postId} />
      </Modal>
      <div
        onClick={() => {
          history.push({
            pathname: history.location.state.prevLocation,
            state: { modal: false, prevLocation: history.location.pathname }
          });
        }}
        className={styles.close}
      >
        <CloseIcon />
      </div>
    </>
  );
}

export default PostModal;

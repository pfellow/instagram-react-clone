import React from 'react';
import { useOptionsDialogStyles } from '../../styles';
import { Button, Dialog, Divider, Zoom } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { defaultPost } from '../../data';

function OptionsDialog({ onClose }) {
  const styles = useOptionsDialogStyles();

  return (
    <Dialog
      open
      classes={{
        scrollPaper: styles.dialogScrollPaper
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <Button className={styles.redButton}>Unfollow</Button>
      <Divider />
      <Button className={styles.button}>
        <Link to={`/p/${defaultPost.id}`}>Go to post</Link>
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

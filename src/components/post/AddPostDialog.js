import React, { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { useAddPostDialogStyles } from '../../styles';
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import { ArrowBackIos, PinDrop } from '@material-ui/icons';
import { useContext } from 'react';
import { UserContext } from '../../App';
import serialize from '../../utils/serialize';
import handleImageUpload from '../../utils/handleImageUpload';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../graphql/mutations';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
];

const AddPostDialog = ({ media, closeHandler }) => {
  const styles = useAddPostDialogStyles();
  const [editor] = useState(() => withReact(createEditor()));
  const [location, setLocation] = useState('');
  const { me, currentUserId } = useContext(UserContext);
  const [value, setValue] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [createPost] = useMutation(CREATE_POST);

  const sharePostHandler = async () => {
    setSubmitting(true);
    const url = await handleImageUpload(media);
    const variables = {
      userId: currentUserId,
      media: url,
      location,
      caption: serialize({ children: value })
    };
    await createPost({ variables });
    setSubmitting(false);
    window.location.reload();
  };

  return (
    <Dialog fullScreen open onClose={closeHandler}>
      <AppBar className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <ArrowBackIos onClick={closeHandler} />
          <Typography align='center' variant='body1' className={styles.title}>
            New Post
          </Typography>
          <Button
            color='primary'
            className={styles.share}
            disabled={submitting}
            onClick={sharePostHandler}
          >
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Paper className={styles.paper}>
        <Avatar src={me.profile_image} />
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <Editable
            className={styles.editor}
            placeholder='Write your caption...'
          />
        </Slate>
        <Avatar
          src={URL.createObjectURL(media)}
          className={styles.avatarLarge}
          variant='square'
        />
      </Paper>
      <TextField
        fullWidth
        placeholder='Location'
        InputProps={{
          classes: {
            root: styles.root,
            input: styles.input,
            underline: styles.underline
          },
          startAdornment: (
            <InputAdornment>
              <PinDrop />
            </InputAdornment>
          )
        }}
        onChange={(event) => setLocation(event.target.value)}
      />
    </Dialog>
  );
};

export default AddPostDialog;

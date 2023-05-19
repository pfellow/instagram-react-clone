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

const AddPostDialog = ({ media, closeHandler }) => {
  const styles = useAddPostDialogStyles();
  const [editor] = useState(() => withReact(createEditor()));
  const [location, setLocation] = useState('');
  const me = useContext(UserContext);

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ];

  const [value, setValue] = useState(initialValue);

  return (
    <Dialog fullScreen open onClose={closeHandler}>
      <AppBar className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <ArrowBackIos onClick={closeHandler} />
          <Typography align='center' variant='body1' className={styles.title}>
            New Post
          </Typography>
          <Button color='primary' className={styles.share}>
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Paper className={styles.paper}>
        <Avatar src={me.me.profile_image} />
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

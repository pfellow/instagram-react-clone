import React, { useState } from 'react';
import { usePostStyles } from '../../styles';
import UserCard from '../shared/UserCard';
import {
  CommentIcon,
  MoreIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  SaveIcon,
  RemoveIcon
} from '../../icons';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Typography,
  Hidden,
  TextField
} from '@material-ui/core';
import OptionsDialog from '../shared/OptionsDialog';
import PostSkeleton from './PostSkeleton';
import { defaultPost } from '../../data';

function Post() {
  const styles = usePostStyles();
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const { media, id, likes, user, caption, comments } = defaultPost;
  const [loading, setLoading] = useState(true);

  setTimeout(() => setLoading(false), 2000);

  if (loading) return <PostSkeleton />;

  return (
    <div className={styles.postContainer}>
      <article className={styles.article}>
        <div className={styles.postHeader}>
          <UserCard user={user} avatarSize={32} />
          <MoreIcon
            className={styles.moreIcon}
            onClick={() => setShowOptionsDialog(true)}
          />
        </div>
        {/* Post Image */}
        <div className={styles.postImage}>
          <img src={media} alt='Post media' className={styles.image} />
        </div>
        {/* Post Buttons */}
        <div className={styles.postButtonsWrapper}>
          <div className={styles.postButtons}>
            <LikeButton />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton />
          </div>
          <Typography className={styles.likes} variant='subtitle2'>
            <span>{likes === 1 ? '1 like' : `${likes} likes`}</span>
          </Typography>
          <div className={styles.postCaptionContainer}>
            <Typography
              variant='body2'
              component='span'
              className={styles.postCaption}
              dangerouslySetInnerHTML={{ __html: caption }}
            />
            {comments.map((comment) => (
              <div key={comment.id}>
                <Link to={`/${comment.user.username}`}>
                  <Typography
                    variant='subtitle2'
                    component='span'
                    className={styles.username}
                  >
                    {comment.user.username}
                  </Typography>{' '}
                  <Typography variant='body2' component='span'>
                    {comment.content}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>

          <Typography color='textSecondary' className={styles.datePosted}>
            5 DAYS AGO
          </Typography>
          <Hidden xsDown>
            <div className={styles.comment}>
              <Divider />
              <Comment />
            </div>
          </Hidden>
        </div>
      </article>
      {showOptionsDialog && (
        <OptionsDialog onClose={() => setShowOptionsDialog(false)} />
      )}
    </div>
  );
}

const LikeButton = () => {
  const styles = usePostStyles();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? styles.liked : styles.like;

  const likeHandler = () => {
    console.log('like');
    setLiked(true);
  };

  const unLikeHandler = () => {
    console.log('unlike');
    setLiked(false);
  };

  const onClick = liked ? unLikeHandler : likeHandler;

  return <Icon className={className} onClick={onClick} />;
};

const SaveButton = () => {
  const styles = usePostStyles();
  const [saved, setsaved] = useState(false);
  const Icon = saved ? RemoveIcon : SaveIcon;

  const saveHandler = () => {
    console.log('save');
    setsaved(true);
  };

  const removeHandler = () => {
    console.log('remove');
    setsaved(false);
  };

  const onClick = saved ? removeHandler : saveHandler;

  return <Icon className={styles.saveIcon} onClick={onClick} />;
};

const Comment = () => {
  const styles = usePostStyles();
  const [content, setContent] = useState('');

  return (
    <div className={styles.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder='Add a comment...'
        multiline
        rowsMax={2}
        rows={1}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textField}
        InputProps={{
          classes: {
            root: styles.root,
            underline: styles.underline
          }
        }}
      />
      <Button
        color='primary'
        className={styles.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  );
};

export default Post;

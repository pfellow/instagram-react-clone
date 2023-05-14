import React, { useState } from 'react';
import { useFeedPostStyles } from '../../styles';
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
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

function FeedPost({ post }) {
  const styles = useFeedPostStyles();
  const [showCaption, setCaption] = useState(false);
  const { media, id, likes, user, caption, comments } = post;

  return (
    <>
      <article className={styles.article}>
        <div className={styles.postHeader}>
          <UserCard user={user} />
          <MoreIcon className={styles.moreIcon} />
        </div>
        {/* Feed Post Image */}
        <div>
          <img src={media} alt='Post media' className={styles.image} />
        </div>
        {/* Feed Post Buttons */}
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
          <div className={showCaption ? styles.expanded : styles.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography
                variant='subtitle2'
                component='span'
                className={styles.username}
              >
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography
                variant='body2'
                component='span'
                dangerouslySetInnerHTML={{ __html: caption }}
              />
            ) : (
              <div className={styles.captionWrapper}>
                <HTMLEllipsis
                  unsafeHTML={caption}
                  className={styles.caption}
                  maxLine='0'
                  ellipsis='...'
                  basedOn='letters'
                />
                <Button
                  className={styles.moreButton}
                  onClick={() => setCaption(true)}
                >
                  more
                </Button>
              </div>
            )}
          </div>
          <Link to={`/p/${id}`}>
            <Typography
              className={styles.commentsLink}
              variant='body2'
              component='div'
            >
              View all {comments.length} comments
            </Typography>
          </Link>
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
          <Typography color='textSecondary' className={styles.datePosted}>
            5 DAYS AGO
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment />
        </Hidden>
      </article>
    </>
  );
}

const LikeButton = () => {
  const styles = useFeedPostStyles();
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
  const styles = useFeedPostStyles();
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
  const styles = useFeedPostStyles();
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

export default FeedPost;

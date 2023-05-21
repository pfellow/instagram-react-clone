import React, { useContext, useState } from 'react';
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
  TextField,
  Avatar
} from '@material-ui/core';
import OptionsDialog from '../shared/OptionsDialog';
import PostSkeleton from './PostSkeleton';
import { useMutation, useSubscription } from '@apollo/client';
import { GET_POST } from '../../graphql/subscriptions';
import { UserContext } from '../../App';
import {
  CREATE_COMMENT,
  LIKE_POST,
  SAVE_POST,
  UNLIKE_POST,
  UNSAVE_POST
} from '../../graphql/mutations';
import { formatDateToNowShort, formatPostDate } from '../../utils/formatDate';
import Image from 'react-graceful-image';

function Post({ postId }) {
  const styles = usePostStyles();
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const { data, loading } = useSubscription(GET_POST, {
    variables: { postId: postId }
  });

  if (loading) return <PostSkeleton />;

  const {
    media,
    id,
    likes,
    likes_aggregate,
    saved_posts,
    location,
    user,
    // user_id,
    caption,
    comments,
    created_at
  } = data.posts_by_pk;

  const likesCount = likes_aggregate.aggregate.count;

  return (
    <div className={styles.postContainer}>
      <article className={styles.article}>
        <div className={styles.postHeader}>
          <UserCard user={user} location={location} avatarSize={32} />
          <MoreIcon
            className={styles.moreIcon}
            onClick={() => setShowOptionsDialog(true)}
          />
        </div>
        {/* Post Image */}
        <div className={styles.postImage}>
          <Image src={media} alt='Post media' className={styles.image} />
        </div>
        {/* Post Buttons */}
        <div className={styles.postButtonsWrapper}>
          <div className={styles.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savedPosts={saved_posts} postId={id} />
          </div>
          <Typography className={styles.likes} variant='subtitle2'>
            <span>{likesCount === 1 ? '1 like' : `${likesCount} likes`}</span>
          </Typography>
          <div
            style={{
              overflowY: 'scroll',
              padding: '16px 12px',
              height: '100%'
            }}
          >
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </div>

          <Typography color='textSecondary' className={styles.datePosted}>
            {formatPostDate(created_at)}
          </Typography>
          <Hidden xsDown>
            <div className={styles.comment}>
              <Divider />
              <Comment postId={id} />
            </div>
          </Hidden>
        </div>
      </article>
      {showOptionsDialog && (
        <OptionsDialog
          postId={postId}
          authorId={user.id}
          onClose={() => setShowOptionsDialog(false)}
        />
      )}
    </div>
  );
}

const AuthorCaption = ({ user, caption, createdAt }) => {
  const styles = usePostStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={user.profile_image}
        alt='User avatar'
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={`/${user.username}`}>
          <Typography
            variant='subtitle2'
            component='span'
            className={styles.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant='body2'
            component='span'
            className={styles.postCaption}
            style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: 'inline-block' }}
          color='textSecondary'
          variant='caption'
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </div>
    </div>
  );
};

const UserComment = ({ comment }) => {
  const styles = usePostStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={comment.user.profile_image}
        alt='User avatar'
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={`/${comment.user.username}`}>
          <Typography
            variant='subtitle2'
            component='span'
            className={styles.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant='body2'
            component='span'
            className={styles.postCaption}
            style={{ paddingLeft: 0 }}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: 'inline-block' }}
          color='textSecondary'
          variant='caption'
        >
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </div>
    </div>
  );
};

const LikeButton = ({ likes, authorId, postId }) => {
  const styles = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? styles.liked : styles.like;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
    type: 'like'
  };

  const likeHandler = () => {
    likePost({ variables });
    setLiked(true);
  };

  const unLikeHandler = () => {
    unlikePost({ variables });
    setLiked(false);
  };

  const onClick = liked ? unLikeHandler : likeHandler;

  return <Icon className={className} onClick={onClick} />;
};

const SaveButton = ({ postId, savedPosts }) => {
  const styles = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [saved, setsaved] = useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
  const variables = { postId, userId: currentUserId };

  const saveHandler = () => {
    savePost({ variables });
    setsaved(true);
  };

  const removeHandler = () => {
    unsavePost({ variables });
    setsaved(false);
  };

  const onClick = saved ? removeHandler : saveHandler;

  return <Icon className={styles.saveIcon} onClick={onClick} />;
};

const Comment = ({ postId }) => {
  const styles = usePostStyles();
  const [content, setContent] = useState('');
  const [createComment] = useMutation(CREATE_COMMENT);
  const { currentUserId } = useContext(UserContext);

  const addCommentHandler = () => {
    const variables = { postId: postId, content, userId: currentUserId };
    createComment({ variables });
    setContent('');
  };

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
        onClick={addCommentHandler}
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

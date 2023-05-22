import React, { useContext, useState } from 'react';
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
import FollowSuggestions from '../shared/FollowSuggestions';
import OptionsDialog from '../shared/OptionsDialog';
import { formatDateToNow } from '../../utils/formatDate';
import Image from 'react-graceful-image';
import {
  SAVE_POST,
  UNSAVE_POST,
  LIKE_POST,
  UNLIKE_POST,
  CREATE_COMMENT
} from '../../graphql/mutations';
import { GET_FEED } from '../../graphql/queries';
import { useMutation } from '@apollo/client';
import { UserContext } from '../../App';

function FeedPost({ post, index }) {
  const styles = useFeedPostStyles();
  const [showCaption, setCaption] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const {
    media,
    id,
    likes,
    likes_aggregate,
    user,
    caption,
    comments,
    comments_aggregate,
    saved_posts,
    location,
    created_at
  } = post;

  const showFollowSuggestions = index === 1;
  const likesCount = likes_aggregate.aggregate.count;
  const commentsCount = comments_aggregate.aggregate.count;

  return (
    <>
      <article
        className={styles.article}
        style={{ marginBottom: showFollowSuggestions && 30 }}
      >
        <div className={styles.postHeader}>
          <UserCard user={user} location={location} />
          <MoreIcon
            className={styles.moreIcon}
            onClick={() => setShowOptionsDialog(true)}
          />
        </div>
        {/* Feed Post Image */}
        <div>
          <Image src={media} alt='Post media' className={styles.image} />
        </div>
        {/* Feed Post Buttons */}
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
              View all {commentsCount} comments
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
            {formatDateToNow(created_at)}
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment postId={id} />
        </Hidden>
      </article>
      {showFollowSuggestions && <FollowSuggestions />}
      {showOptionsDialog && (
        <OptionsDialog
          authorId={user.id}
          postId={id}
          onClose={() => setShowOptionsDialog(false)}
        />
      )}
    </>
  );
}

const LikeButton = ({ likes, postId, authorId }) => {
  const styles = useFeedPostStyles();
  const { currentUserId, feedIds } = useContext(UserContext);
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

  const updateHandler = (cache, result) => {
    const variables = {
      limit: 2,
      feedIds,
      lastTimestamp: '2100-01-01T00:00:00.000001+00:00'
    };
    const data = cache.readQuery({ query: GET_FEED, variables });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === 'likes_mutation_response' ? 1 : -1;
    const posts = data.posts.map((post) => ({
      ...post,
      likes_aggregate: {
        ...post.likes_aggregate,
        aggregate: {
          ...post.likes_aggregate.aggregate,
          count: post.likes_aggregate.aggregate.count + count
        }
      }
    }));
    cache.writeQuery({ query: GET_FEED, data: { posts } });
  };

  const likeHandler = () => {
    setLiked(true);
    likePost({ variables, update: updateHandler });
  };

  const unLikeHandler = () => {
    setLiked(false);
    unlikePost({ variables, update: updateHandler });
  };

  const onClick = liked ? unLikeHandler : likeHandler;

  return <Icon className={className} onClick={onClick} />;
};

const SaveButton = ({ postId, savedPosts }) => {
  const styles = useFeedPostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [saved, setsaved] = useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const [savePost] = useMutation(SAVE_POST);
  const [removePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId
  };

  const saveHandler = () => {
    setsaved(true);
    savePost({ variables });
  };

  const removeHandler = () => {
    setsaved(false);
    removePost({ variables });
  };

  const onClick = saved ? removeHandler : saveHandler;

  return <Icon className={styles.saveIcon} onClick={onClick} />;
};

const Comment = ({ postId }) => {
  const { currentUserId, feedIds } = useContext(UserContext);
  const styles = useFeedPostStyles();
  const [content, setContent] = useState('');
  const [createComment] = useMutation(CREATE_COMMENT);

  const updateHandler = (cache, result) => {
    const variables = {
      limit: 2,
      feedIds,
      lastTimestamp: '2100-01-01T00:00:00.000001+00:00'
    };
    const data = cache.readQuery({
      query: GET_FEED,
      variables
    });
    const oldComment = result.data.insert_comments.returning[0];
    const newComment = {
      ...oldComment,
      user: { ...oldComment.user }
    };
    const posts = data.posts.map((post) => {
      const newPost = {
        ...post,
        comments: [...post.comments, newComment],
        comments_aggregate: {
          ...post.comments_aggregate,
          aggregate: {
            ...post.comments_aggregate.aggregate,
            count: post.comments_aggregate.aggregate.count + 1
          }
        }
      };
      return post.id === postId ? newPost : post;
    });
    cache.writeQuery({ query: GET_FEED, data: { posts } });
    setContent('');
  };

  const addCommentHandler = () => {
    const variables = {
      content,
      postId,
      userId: currentUserId
    };
    createComment({ variables, update: updateHandler });
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
        color='primary'
        className={styles.commentButton}
        disabled={!content.trim()}
        onClick={addCommentHandler}
      >
        Post
      </Button>
    </div>
  );
};

export default FeedPost;

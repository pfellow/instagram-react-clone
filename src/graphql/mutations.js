import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUsers(
    $userId: String!
    $name: String!
    $username: String!
    $email: String!
    $bio: String!
    $website: String!
    $profileImage: String!
    $phoneNumber: String!
  ) {
    insert_users(
      objects: {
        bio: $bio
        email: $email
        name: $name
        phone_number: $phoneNumber
        profile_image: $profileImage
        user_id: $userId
        username: $username
        website: $website
      }
    ) {
      affected_rows
    }
  }
`;

export const EDIT_USER = gql`
  mutation efitUser(
    $id: uuid!
    $name: String!
    $username: String!
    $email: String!
    $bio: String!
    $website: String!
    $phoneNumber: String!
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        bio: $bio
        email: $email
        name: $name
        phone_number: $phoneNumber
        username: $username
        website: $website
      }
    ) {
      affected_rows
    }
  }
`;

export const EDIT_USER_AVATAR = gql`
  mutation efitUser($id: uuid!, $profileImage: String!) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { profile_image: $profileImage }
    ) {
      affected_rows
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost(
    $userId: uuid!
    $media: String!
    $location: String!
    $caption: String!
  ) {
    insert_posts(
      objects: {
        user_id: $userId
        media: $media
        location: $location
        caption: $caption
      }
    ) {
      affected_rows
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost(
    $postId: uuid!
    $userId: uuid!
    $profileId: uuid!
    $type: String!
  ) {
    insert_likes(objects: { post_id: $postId, user_id: $userId }) {
      affected_rows
    }
    insert_notifications(
      objects: {
        post_id: $postId
        user_id: $userId
        profile_id: $profileId
        type: $type
      }
    ) {
      affected_rows
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation unlikePost(
    $postId: uuid!
    $userId: uuid!
    $profileId: uuid!
    $type: String!
  ) {
    delete_likes(
      where: { post_id: { _eq: $postId }, user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
    delete_notifications(
      where: {
        post_id: { _eq: $postId }
        profile_id: { _eq: $profileId }
        user_id: { _eq: $userId }
        type: { _eq: $type }
      }
    ) {
      affected_rows
    }
  }
`;

export const SAVE_POST = gql`
  mutation savePost($postId: uuid!, $userId: uuid!) {
    insert_saved_posts(objects: { post_id: $postId, user_id: $userId }) {
      affected_rows
    }
  }
`;

export const UNSAVE_POST = gql`
  mutation unsavePost($postId: uuid!, $userId: uuid!) {
    delete_saved_posts(
      where: { post_id: { _eq: $postId }, user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($content: String!, $postId: uuid!, $userId: uuid!) {
    insert_comments(
      objects: { content: $content, post_id: $postId, user_id: $userId }
    ) {
      affected_rows
    }
  }
`;

export const CHECK_NOTIFICATIONS = gql`
  mutation checkNotifications($userId: uuid!, $lastChecked: String!) {
    update_users(
      where: { id: { _eq: $userId } }
      _set: { last_checked: $lastChecked }
    ) {
      affected_rows
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation followUser($userIdToFollow: uuid!, $currentUserId: uuid!) {
    insert_followers(
      objects: { user_id: $userIdToFollow, profile_id: $currentUserId }
    ) {
      affected_rows
    }
    insert_following(
      objects: { user_id: $currentUserId, profile_id: $userIdToFollow }
    ) {
      affected_rows
    }
    insert_notifications(
      objects: {
        user_id: $currentUserId
        profile_id: $userIdToFollow
        type: "follow"
      }
    ) {
      affected_rows
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($userIdToFollow: uuid!, $currentUserId: uuid!) {
    delete_followers(
      where: {
        user_id: { _eq: $userIdToFollow }
        profile_id: { _eq: $currentUserId }
      }
    ) {
      affected_rows
    }
    delete_following(
      where: {
        user_id: { _eq: $currentUserId }
        profile_id: { _eq: $userIdToFollow }
      }
    ) {
      affected_rows
    }
    delete_notifications(
      where: {
        user_id: { _eq: $currentUserId }
        profile_id: { _eq: $userIdToFollow }
        type: { _eq: "follow" }
      }
    ) {
      affected_rows
    }
  }
`;

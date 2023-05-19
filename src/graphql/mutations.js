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

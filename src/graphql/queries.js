import { gql } from '@apollo/client';

export const CHECK_IF_USERNAME_IS_TAKEN = gql`
  query checkUsername($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

export const GET_USER_EMAIL = gql`
  query MyQuery($input: String!) {
    users(
      where: {
        _or: [{ phone_number: { _eq: $input } }, { username: { _eq: $input } }]
      }
    ) {
      email
    }
  }
`;

export const GET_EDIT_USER_PROFILE = gql`
  query getEditUserProfile($id: uuid!) {
    users_by_pk(id: $id) {
      username
      name
      email
      bio
      profile_image
      website
      phone_number
      id
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUsers($query: String) {
    users(
      where: {
        _or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }]
      }
    ) {
      name
      username
      profile_image
      id
    }
  }
`;

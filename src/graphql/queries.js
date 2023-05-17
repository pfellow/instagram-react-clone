import { gql } from '@apollo/client';

export const CHECK_IF_USERNAME_IS_TAKEN = gql`
  query checkUsername($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

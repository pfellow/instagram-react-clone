import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import key from '../key.json';

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://advanced-giraffe-98.hasura.app/v1/graphql',
    options: {
      reconnect: true
    },
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': key.authToken
      }
    }
  })
);

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

export default client;

import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql', 
  }),
  cache: new InMemoryCache(),
});

export default client;

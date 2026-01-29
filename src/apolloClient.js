import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    //uri: "https://api.spacex.land/graphql",
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache(),
  });

export default client;
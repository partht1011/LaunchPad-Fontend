// src/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/95198/ido-graph/v8', // Replace with your subgraph URL
    cache: new InMemoryCache(),
});

export default client;

import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import isomorphicUnfetch from "isomorphic-unfetch";

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
// if (!process.browser) {
//   global.fetch = fetch
// }

function create(initialState) {
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: !!process.browser,
    link: new HttpLink({
      credentials: "same-origin",
      fetch: isomorphicUnfetch,
    }),
    ssrMode: !process.browser,
  });
}

export default function initApollo(initialState) {
  if (!process.browser) {
    return create(initialState);
  }
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}

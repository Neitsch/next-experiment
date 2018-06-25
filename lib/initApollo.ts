import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import isomorphicUnfetch from "isomorphic-unfetch";

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
// if (!process.browser) {
//   global.fetch = fetch
// }

export const setAuthorizationLink = jwt =>
  setContext(() => ({
    headers: {
      authorization: "Bearer " + jwt,
    },
  }));

function create(initialState, jwt) {
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: !!process.browser,
    link: setAuthorizationLink(jwt).concat(
      createPersistedQueryLink().concat(
        new HttpLink({
          credentials: "same-origin",
          fetch: isomorphicUnfetch,
          uri: "http://localhost:3000/graphql",
        }),
      ),
    ),
    ssrMode: !process.browser,
  });
}

export const resetClient = () => {
  apolloClient = null;
};

export default function initApollo(initialState, jwt) {
  if (!process.browser) {
    return create(initialState, jwt);
  }
  if (!apolloClient) {
    apolloClient = create(initialState, jwt);
  }
  return apolloClient;
}

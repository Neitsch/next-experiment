import { Hermes } from "apollo-cache-hermes";
import { persistCache } from "apollo-cache-persist";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import isomorphicUnfetch from "isomorphic-unfetch";
import localForage from "localforage";

let apolloClient = null;

export const setAuthorizationLink = jwt =>
  setContext(() => ({
    headers: {
      authorization: "Bearer " + jwt,
    },
  }));

export const setupLink = jwt =>
  setAuthorizationLink(jwt).concat(
    createPersistedQueryLink().concat(
      new HttpLink({
        credentials: "same-origin",
        fetch: isomorphicUnfetch,
        uri: "http://localhost:3000/graphql",
      }),
    ),
  );

function create(jwt) {
  const cache = new Hermes({});
  if (process.browser) {
    persistCache({
      cache,
      storage: localForage,
    });
  }
  return new ApolloClient({
    cache,
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

export default function initApollo(jwt) {
  if (!process.browser) {
    return create(jwt);
  }
  if (!apolloClient) {
    apolloClient = create(jwt);
  }
  return apolloClient;
}

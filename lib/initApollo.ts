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

const getUri = () =>
  process.browser
    ? "/graphql"
    : `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/graphql`;

export const setupLink = jwt =>
  setAuthorizationLink(jwt).concat(
    createPersistedQueryLink().concat(
      new HttpLink({
        credentials: "same-origin",
        fetch: isomorphicUnfetch,
        uri: getUri(),
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
          uri: getUri(),
        }),
      ),
    ),
    ssrMode: !process.browser,
  });
}

export default function initApollo(jwt) {
  if (!process.browser) {
    return create(jwt);
  }
  if (!apolloClient) {
    apolloClient = create(jwt);
  }
  return apolloClient;
}

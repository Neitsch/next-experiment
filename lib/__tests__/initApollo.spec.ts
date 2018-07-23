import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";

import InitApollo, { setAuthorizationLink } from "../initApollo";

jest.unmock("../initApollo");

describe("Init Apollo", () => {
  let concat;
  beforeAll(() => {
    concat = jest.fn().mockImplementation(() => ({ concat }));
    setContext.mockReturnValue({
      concat,
    });
    createPersistedQueryLink.mockReturnValue({
      concat,
    });
  });

  it("Creates Server", () => {
    process.browser = false;
    InitApollo(null);
    expect(ApolloClient.mock.calls[0][0].ssrMode).toBeTruthy();
    expect(HttpLink.mock.calls[0][0].uri).toEqual(
      "http://localhost:3000/graphql",
    );
  });
  it("Creates Client", () => {
    process.browser = true;
    InitApollo(null);
    expect(ApolloClient.mock.calls[0][0].ssrMode).toBeFalsy();
    expect(HttpLink.mock.calls[0][0].uri).toEqual("/graphql");
  });
  it("Reuses client", () => {
    process.browser = true;
    const apollo1 = InitApollo(null);
    const apollo2 = InitApollo(null);
    expect(apollo1).toEqual(apollo2);
  });
  it("Sets jwt", () => {
    process.browser = false;
    InitApollo("my jwt");
    expect(setContext.mock.calls[0][0]().headers.authorization).toEqual(
      "Bearer my jwt",
    );
  });
  it("Sets link", () => {
    process.browser = false;
    InitApollo(null);
    expect(ApolloClient.mock.calls[0][0].link).toEqual({ concat });
  });
});

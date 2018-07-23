import setupCall from "next-with-apollo";
import { getLocalCookie, getServerCookie } from "../auth/index";

import withApolloClient from "../withApolloClient";

jest.unmock("../withApolloClient");
jest.mock("next-with-apollo", () => jest.fn());

describe("Apollo Setup", () => {
  it("Client", () => {
    getLocalCookie.mockReturnValue("Cookie");
    withApolloClient();
    setupCall.mock.calls[0][0]({});
    expect(getLocalCookie).toHaveBeenCalledTimes(1);
  });
  it("Server", () => {
    getServerCookie.mockReturnValue("Cookie");
    withApolloClient();
    setupCall.mock.calls[0][0]({ headers: {} });
    expect(getServerCookie).toHaveBeenCalledTimes(1);
  });
});

describe("Apollo Setup", () => {
  test("Client", () => {
    jest.resetAllMocks();
    jest.resetModules();
    const setupCall = jest.fn();
    const getLocalCookie = jest.fn().mockReturnValue("Cookie");
    jest.doMock("next-with-apollo", () => setupCall);
    jest.doMock("../auth/index", () => ({
      getLocalCookie,
    }));
    jest.doMock("../initApollo", () => jest.fn());
    require("../withApolloClient");
    setupCall.mock.calls[0][0]({});
    expect(getLocalCookie).toHaveBeenCalledTimes(1);
  });
  test("Client", () => {
    jest.resetAllMocks();
    jest.resetModules();
    const setupCall = jest.fn();
    const getServerCookie = jest.fn().mockReturnValue("Cookie");
    jest.doMock("next-with-apollo", () => setupCall);
    jest.doMock("../auth/index", () => ({
      getServerCookie,
    }));
    jest.doMock("../initApollo", () => jest.fn());
    require("../withApolloClient");
    setupCall.mock.calls[0][0]({ headers: {} });
    expect(getServerCookie).toHaveBeenCalledTimes(1);
  });
});

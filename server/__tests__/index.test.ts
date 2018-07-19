describe("Server", () => {
  it("Starts", () => {
    const reqHandler = jest.fn();
    let serverLauncher: () => void;
    let errorFunc: (v?: any) => void;
    let setPort;
    const consoleErrorSave = console.error;
    console.error = jest.fn();
    const promise = {
      catch: jest.fn(),
    };
    const nonce = "abc";
    jest.doMock("uuid", () => ({
      v4: jest.fn().mockReturnValue(nonce),
    }));
    jest.doMock("../../lib/routes", () => ({
      getRequestHandler: () => reqHandler,
    }));
    jest.doMock("next", () => () => ({
      prepare: () => ({
        then: (fn: any) => {
          serverLauncher = fn;
          return promise;
        },
      }),
    }));
    const innerGql = {
      applyMiddleware: jest.fn(),
    };
    const getFn = jest.fn();
    const gqlFn = jest.fn().mockImplementation(() => innerGql);
    const useFn = jest.fn();
    jest.doMock("body-parser", () => ({ json: jest.fn() }));
    jest.doMock("compression", () => jest.fn());
    jest.doMock("cookie-parser", () => jest.fn());
    jest.doMock("cors", () => jest.fn());
    jest.doMock("express", () => () => ({
      get: getFn,
      listen: jest.fn().mockImplementation((port, fn2) => {
        setPort = port;
        errorFunc = fn2;
      }),
      use: useFn,
    }));
    jest.doMock("express-jwt", () => jest.fn());
    jest.doMock("jwks-rsa", () => ({
      expressJwtSecret: jest.fn(),
    }));
    jest.doMock("apollo-server-express", () => ({
      ApolloServer: gqlFn,
    }));
    jest.doMock("graphql-validation-complexity");
    require("../index");
    serverLauncher!();
    expect(reqHandler).toHaveBeenCalledTimes(0);
    const url = "http://www.abc.com/123";
    const urlCall = { url };
    const otherArg = {};
    getFn.mock.calls[0][1](urlCall, otherArg);
    expect(reqHandler).toHaveBeenCalledTimes(1);
    expect(reqHandler).toHaveBeenCalledWith(urlCall, otherArg);
    expect(setPort).toEqual(3000);
    expect(() => {
      errorFunc!(new Error(":)"));
    }).toThrow();
    expect(() => {
      errorFunc!();
    }).not.toThrow();
    expect(() => {
      promise.catch.mock.calls[0][0]("Test");
    }).not.toThrow();
    expect(
      gqlFn.mock.calls[0][0].context({ req: { user: { sub: "Test" } } })
        .userSub,
    ).toEqual("Test");
    const resFn = jest.fn();
    useFn.mock.calls[6][0](new Error("test"), null, { json: resFn });
    expect(resFn.mock.calls).toMatchSnapshot();
    const cb = jest.fn();
    const res = { locals: {} };
    useFn.mock.calls[4][0]({}, res, cb);
    expect(cb).toHaveBeenCalled();
    expect(res.locals).toHaveProperty("nonce");
    expect(console.error).toHaveBeenCalledWith("Test");
    console.error = consoleErrorSave;
  });
});

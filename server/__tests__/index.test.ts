describe("Server", () => {
  it("Starts", () => {
    const reqHandler = jest.fn();
    let serverLauncher;
    let errorFunc;
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
    jest.doMock("../../typeDefs/nextShim", () => ({
      nextServer: () => ({
        getRequestHandler: () => reqHandler,
        prepare: () => ({
          then: fn => {
            serverLauncher = fn;
            return promise;
          },
        }),
      }),
    }));
    const innerGql = {
      applyMiddleware: jest.fn(),
    };
    const getFn = jest.fn();
    const gqlFn = jest.fn().mockImplementation(() => innerGql);
    const useFn = jest.fn();
    jest.doMock("../../typeDefs/expressShim", () => {
      return {
        bodyParser: { json: jest.fn() },
        compression: jest.fn(),
        cookieParser: jest.fn(),
        cors: jest.fn(),
        expressServer: () => ({
          get: getFn,
          listen: jest.fn().mockImplementation((port, fn2) => {
            setPort = port;
            errorFunc = fn2;
          }),
          use: useFn,
        }),
        graphqlHTTP: gqlFn,
        jwksRsa: {
          expressJwtSecret: jest.fn(),
        },
        jwt: jest.fn(),
      };
    });
    jest.doMock("apollo-server-express", () => ({
      ApolloServer: gqlFn,
    }));
    jest.doMock("graphql-validation-complexity");
    require("../index");
    serverLauncher();
    expect(reqHandler).toHaveBeenCalledTimes(0);
    const url = "http://www.abc.com/123";
    const urlCall = { url, params: {} };
    const otherArg = {
      set: jest.fn(),
    };
    getFn.mock.calls[0][1](urlCall, otherArg);
    expect(otherArg.set).toHaveBeenCalled();
    // @ts-ignore
    expect(urlCall.params.nonce).toEqual(nonce);
    expect(reqHandler).toHaveBeenCalledTimes(1);
    expect(reqHandler).toHaveBeenCalledWith(urlCall, otherArg);
    expect(setPort).toEqual(3000);
    expect(() => {
      errorFunc(new Error(":)"));
    }).toThrow();
    expect(() => {
      errorFunc();
    }).not.toThrow();
    expect(() => {
      promise.catch.mock.calls[0][0]("Test");
    }).not.toThrow();
    expect(
      gqlFn.mock.calls[0][0].context({ req: { user: { sub: "Test" } } })
        .userSub,
    ).toEqual("Test");
    const resFn = jest.fn();
    useFn.mock.calls[4][0](new Error("test"), null, { json: resFn });
    expect(resFn.mock.calls).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledWith("Test");
    console.error = consoleErrorSave;
  });
});

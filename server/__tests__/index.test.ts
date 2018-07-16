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
    const innerGql = jest.fn();
    const getFn = jest.fn();
    const gqlFn = jest.fn().mockReturnValue(innerGql);
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
      graphiqlExpress: jest.fn(),
      graphqlExpress: gqlFn,
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
    const reqIn = { user: { sub: "SUB" } };
    useFn.mock.calls[3][3](reqIn, otherArg);
    expect(useFn.mock.calls[3][3]).toEqual(innerGql);
    expect(
      gqlFn.mock.calls[0][0]({ user: { sub: "MySub" } }),
    ).toMatchSnapshot();
    expect(() => {
      promise.catch.mock.calls[0][0]("Test");
    }).not.toThrow();
    const resFn = jest.fn();
    useFn.mock.calls[5][0](new Error("test"), null, { json: resFn });
    expect(resFn.mock.calls).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledWith("Test");
    console.error = consoleErrorSave;
  });
});

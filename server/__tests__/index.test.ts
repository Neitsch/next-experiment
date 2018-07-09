describe("Server", () => {
  xit("Starts", () => {
    const reqHandler = jest.fn();
    let serverLauncher;
    let errorFunc;
    let setPort;
    const promise = {
      catch: jest.fn(),
    };
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
    require("../index");
    serverLauncher();
    expect(reqHandler).toHaveBeenCalledTimes(0);
    const url = "http://www.abc.com/123";
    const urlCall = { url };
    const otherArg = jest.fn();
    getFn.mock.calls[0][1](urlCall, otherArg);
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
    useFn.mock.calls[3][2](reqIn, otherArg);
    expect(innerGql).toHaveBeenCalledWith(reqIn, otherArg);
    expect(() => {
      promise.catch.mock.calls[0][0]("Test");
    }).not.toThrow();
  });
});

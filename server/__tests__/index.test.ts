describe("Server", () => {
  it("Starts", () => {
    const reqHandler = jest.fn();
    let handlerFunc;
    let serverLauncher;
    let errorFunc;
    let setPort;
    jest.doMock("../../typeDefs/nextShim", () => ({
      nextServer: () => ({
        getRequestHandler: () => reqHandler,
        prepare: () => ({
          then: fn => {
            serverLauncher = fn;
          },
        }),
      }),
    }));
    jest.doMock("http", () => ({
      createServer: fn1 => {
        handlerFunc = fn1;
        return {
          listen: jest.fn().mockImplementation((port, fn2) => {
            setPort = port;
            errorFunc = fn2;
          }),
        };
      },
    }));
    jest.doMock("url");
    require("../index");
    serverLauncher();
    expect(reqHandler).toHaveBeenCalledTimes(0);
    handlerFunc({ url: "http://www.abc.com/123" });
    expect(reqHandler).toHaveBeenCalledTimes(1);
    expect(setPort).toEqual(3000);
    expect(() => {
      errorFunc(new Error(":)"));
    }).toThrow();
    expect(() => {
      errorFunc();
    }).not.toThrow();
  });
});

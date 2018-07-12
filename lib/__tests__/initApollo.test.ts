describe("Init Apollo", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("localforage", () => jest.fn());
    jest.doMock("apollo-cache-persist", () => ({
      persistCache: jest.fn(),
    }));
  });

  describe("Server", () => {
    it("Creates - no data", () => {
      process.browser = false;
      const InitApollo = require("../initApollo").default;
      const apollo = InitApollo(null);
      expect(apollo.cache._queryable._snapshot.baseline._values).toEqual({});
      expect(apollo.ssrMode).toBe(true);
    });
  });

  describe("Browser", () => {
    it("Creates - no data", () => {
      process.browser = true;
      const InitApollo = require("../initApollo").default;
      const apollo = InitApollo(null);
      expect(apollo.cache._queryable._snapshot.baseline._values).toEqual({});
      expect(apollo.ssrMode).toBe(false);
    });
    it("Creates - no duplicate", () => {
      process.browser = true;
      const InitApollo = require("../initApollo").default;
      const apollo1 = InitApollo({});
      const apollo2 = InitApollo({});
      expect(Object.is(apollo1, apollo2)).toBe(true);
    });
  });

  it("Auth link", () => {
    const setContext = jest.fn();
    jest.doMock("apollo-link-context", () => ({
      setContext,
    }));
    require("../initApollo").setAuthorizationLink("My jwt");
    expect(setContext.mock.calls[0][0]()).toMatchSnapshot();
  });
});

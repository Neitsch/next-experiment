import InitApollo, { resetClient } from "../initApollo";

describe("Init Apollo", () => {
  beforeEach(() => {
    resetClient();
  });

  describe("Server", () => {
    it("Creates - no data", () => {
      process.browser = false;
      const apollo = InitApollo(null);
      expect(apollo.cache.data.data).toEqual({});
      expect(apollo.ssrMode).toBe(true);
    });
    it("Creates - data", () => {
      process.browser = false;
      const data = {
        testData: "Hi",
      };
      const apollo = InitApollo(data);
      expect(apollo.cache.data.data).toEqual(data);
      expect(apollo.ssrMode).toBe(true);
    });
  });

  describe("Browser", () => {
    it("Creates - no data", () => {
      process.browser = true;
      const apollo = InitApollo(null);
      expect(apollo.cache.data.data).toEqual({});
      expect(apollo.ssrMode).toBe(false);
    });
    it("Creates - data", () => {
      process.browser = true;
      const data = {
        testData: "Hi",
      };
      const apollo = InitApollo(data);
      expect(apollo.cache.data.data).toEqual(data);
      expect(apollo.ssrMode).toBe(false);
    });
    it("Creates - no duplicate", () => {
      process.browser = true;
      const apollo1 = InitApollo({});
      const apollo2 = InitApollo({});
      expect(Object.is(apollo1, apollo2)).toBe(true);
    });
  });
});

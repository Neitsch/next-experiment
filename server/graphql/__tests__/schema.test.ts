import Schema from "../schema";

describe("Graphql", () => {
  describe("Query", () => {
    it("Resolves", () => {
      const res = Schema.getQueryType()
        .getFields()
        .user.resolve("test", null, null, null);
      expect(res).toBe("test");
    });
  });
});

import Schema from "../schema";

describe("Graphql", () => {
  describe("Query", () => {
    it("Resolves", () => {
      const res = Schema.getQueryType()
        .getFields()
        .user.resolve(null, null, { userSub: "test" }, null);
      expect(res).toBe("test");
    });
  });
});

import { GraphQLObjectType, GraphQLResolveInfo } from "graphql";

jest.unmock("../GraphQLUser");

describe("Graphql", () => {
  describe("User", () => {
    it("Resolves", () => {
      require("../GraphQLUser");
      // @ts-ignore
      const resolveInfo: GraphQLResolveInfo = {};
      // @ts-ignore
      const res = GraphQLObjectType.mock.calls[0][0].fields.id.resolve(
        {
          uuid: "test uuid",
        },
        {},
        {},
        resolveInfo,
      )!;
      expect(res).toBe("test uuid");
    });
  });
});

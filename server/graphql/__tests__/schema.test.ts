import { GraphQLResolveInfo } from "graphql";

import Schema from "../schema";

describe("Graphql", () => {
  describe("Query", () => {
    it("Resolves", () => {
      const querytypes = Schema!.getQueryType()!;
      const fields = querytypes.getFields()!;
      const userField = fields.user!;
      // @ts-ignore
      const resolveInfo: GraphQLResolveInfo = {};
      const res = userField.resolve!("test", {}, null, resolveInfo)!;
      expect(res).toBe("test");
    });
  });
});

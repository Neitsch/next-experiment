jest.unmock("../schema");

describe("Graphql", () => {
  describe("Schema", () => {
    it("exists", () => {
      expect(require("../schema")).toBeTruthy();
    });
  });
});

jest.unmock("../routes");

describe("Routes", () => {
  it("works", () => {
    const MyRoutes = require("../routes");
    expect(MyRoutes).not.toBeNull();
  });
});

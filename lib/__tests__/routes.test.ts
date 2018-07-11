import * as Routes from "next-routes";

jest.mock("next-routes");

describe("Routes", () => {
  it("works", () => {
    Routes.default.mockImplementation(() => ({
      add: jest.fn().mockReturnValue({
        Link: jest.fn(),
        Router: jest.fn(),
      }),
    }));
    const MyRoutes = require("../routes");
    expect(MyRoutes).not.toBeNull();
  });
});

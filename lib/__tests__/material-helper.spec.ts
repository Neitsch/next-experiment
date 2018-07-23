import { getPageContext } from "../material-helper";

jest.unmock("../material-helper");

describe("Page Context", () => {
  it("creates new server", () => {
    const ctx = getPageContext();
    expect(ctx).toMatchSnapshot();
    expect(ctx).not.toBe(getPageContext());
  });
  it("creates new client", () => {
    process.browser = true;
    const ctx = getPageContext();
    expect(ctx).toMatchSnapshot();
  });
  it("creates reload client", () => {
    process.browser = true;
    global.__INIT_MATERIAL_UI__ = jest.fn();
    const ctx = getPageContext();
    expect(ctx).toBe(global.__INIT_MATERIAL_UI__);
  });
});

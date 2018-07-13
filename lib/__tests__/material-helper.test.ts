describe("Page Context", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("creates new server", () => {
    jest.doMock("jss", () => ({
      SheetsRegistry: jest.fn(),
    }));
    jest.doMock("@material-ui/core/styles", () => ({
      createGenerateClassName: jest.fn(),
      createMuiTheme: jest.fn(),
    }));
    const ctx = require("../material-helper").getPageContext();
    expect(ctx).toMatchSnapshot();
    expect(ctx).not.toBe(require("../material-helper").getPageContext());
  });
  it("creates new client", () => {
    process.browser = true;
    jest.doMock("jss", () => ({
      SheetsRegistry: jest.fn(),
    }));
    jest.doMock("@material-ui/core/styles", () => ({
      createGenerateClassName: jest.fn(),
      createMuiTheme: jest.fn(),
    }));
    const ctx = require("../material-helper").getPageContext();
    expect(ctx).toMatchSnapshot();
  });
  it("creates reload client", () => {
    process.browser = true;
    global.__INIT_MATERIAL_UI__ = jest.fn();
    jest.doMock("jss", () => ({
      SheetsRegistry: jest.fn(),
    }));
    jest.doMock("@material-ui/core/styles", () => ({
      createGenerateClassName: jest.fn(),
      createMuiTheme: jest.fn(),
    }));
    const ctx = require("../material-helper").getPageContext();
    expect(ctx).toBe(global.__INIT_MATERIAL_UI__);
  });
});

describe("get lock", () => {
  test("works", () => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.doMock("../config.json", () => ({
      AUTH0_CLIENT_DOMAIN: "client_domain",
      AUTH0_CLIENT_ID: "client_id",
    }));
    jest.doMock("../index");
    jest.doMock("uuid");
    const lockConstructor = jest
      .fn()
      .mockImplementation(() => ({ show: jest.fn() }));
    jest.doMock("auth0-lock", () => ({
      default: lockConstructor,
    }));
    require("../lock").show("my-container");
    expect(lockConstructor.mock.calls).toMatchSnapshot();
  });
});

describe("logout", () => {
  test("works", () => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.doMock("../config.json", () => ({
      AUTH0_CLIENT_DOMAIN: "client_domain",
      AUTH0_CLIENT_ID: "client_id",
    }));
    jest.doMock("../index");
    jest.doMock("uuid");
    const lockConstructor = jest
      .fn()
      .mockImplementation(() => ({ logout: jest.fn() }));
    jest.doMock("auth0-lock", () => ({
      default: lockConstructor,
    }));
    require("../lock").logout();
    // expect(() => require("../lock").logout()).not.toThrow();
  });
});

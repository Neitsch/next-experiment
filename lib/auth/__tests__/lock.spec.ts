import Auth0Lock from "auth0-lock";

import { setSecret } from "../index";
import { lock, logout, show } from "../lock";

jest.unmock("../lock");

describe("get lock", () => {
  it("works", () => {
    jest.doMock("../config.json", () => ({
      AUTH0_CLIENT_DOMAIN: "client_domain",
      AUTH0_CLIENT_ID: "client_id",
    }));
    const lockConstructor = Auth0Lock.mockImplementation(() => ({
      show: jest.fn(),
    }));
    jest.doMock("auth0-lock", () => ({
      default: lockConstructor,
    }));
    show("my-container");
    expect(Auth0Lock.mock.calls).toMatchSnapshot();
  });
});

describe("logout", () => {
  it("works", () => {
    jest.doMock("../config.json", () => ({
      AUTH0_CLIENT_DOMAIN: "client_domain",
      AUTH0_CLIENT_ID: "client_id",
    }));
    const lockConstructor = Auth0Lock.mockImplementation(() => ({
      logout: jest.fn(),
    }));
    jest.doMock("auth0-lock", () => ({
      default: lockConstructor,
    }));
    logout();
  });

  it("Raw lock", () => {
    jest.doMock("../config.json", () => ({
      AUTH0_CLIENT_DOMAIN: "client_domain",
      AUTH0_CLIENT_ID: "client_id",
    }));
    lock("test-container");
    expect(Auth0Lock.mock.calls).toMatchSnapshot();
    expect(setSecret).toHaveBeenCalled();
  });
});

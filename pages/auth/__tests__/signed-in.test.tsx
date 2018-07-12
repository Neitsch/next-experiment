import { shallow } from "enzyme";
import React from "react";

describe("Signed In", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("works", () => {
    const checkSecretFn = jest.fn().mockReturnValue(true);
    const extractInfoFromHashFn = jest.fn().mockReturnValue({
      access_token: "access token",
      secret: "secret",
      token: "token",
    });
    const setTokenFn = jest.fn();
    const innerRouter = {
      pushRoute: jest.fn(),
    };
    const Router = {
      Router: innerRouter,
    };

    jest.doMock("../../../lib/routes", () => Router);
    jest.doMock("../../../lib/auth/index", () => ({
      checkSecret: checkSecretFn,
      extractInfoFromHash: extractInfoFromHashFn,
      setToken: setTokenFn,
    }));

    const SignedIn = require("../signed-in").default;
    const rendered = shallow(<SignedIn />);
    expect(rendered).toMatchSnapshot();
    expect(checkSecretFn).toHaveBeenCalledTimes(1);
    expect(extractInfoFromHashFn).toHaveBeenCalledTimes(1);
    expect(innerRouter.pushRoute).toHaveBeenCalledWith("index");
  });
  it("fails without token", () => {
    jest.resetModules();
    jest.resetAllMocks();
    const checkSecretFn = jest.fn().mockReturnValue(false);
    const extractInfoFromHashFn = jest.fn().mockReturnValue({
      access_token: "access token",
      secret: "secret",
      token: null,
    });
    const setTokenFn = jest.fn();
    const innerRouter = {
      push: jest.fn(),
    };
    const Router = {
      router: innerRouter,
    };

    jest.doMock("next/router", () => Router);
    jest.doMock("../../../lib/auth/index", () => ({
      checkSecret: checkSecretFn,
      extractInfoFromHash: extractInfoFromHashFn,
      setToken: setTokenFn,
    }));

    const SignedIn = require("../signed-in").default;
    const rendered = shallow(<SignedIn />);
    expect(rendered).toMatchSnapshot();
    expect(checkSecretFn).toHaveBeenCalledTimes(1);
    expect(extractInfoFromHashFn).toHaveBeenCalledTimes(1);
    expect(innerRouter.push).not.toHaveBeenCalled();
  });
});

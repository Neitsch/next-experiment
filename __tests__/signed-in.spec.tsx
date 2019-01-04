import { shallow } from "enzyme";
import React from "react";

import { checkSecret, extractInfoFromHash } from "../lib/auth/index";
import InitApollo from "../lib/initApollo";
import { Router } from "../lib/routes";
import SignedIn from "../pages/auth/signed-in";

jest.unmock("../pages/auth/signed-in");

describe("Signed In", () => {
  it("works", () => {
    InitApollo.mockReturnValue({});
    checkSecret.mockReturnValue(true);
    extractInfoFromHash.mockReturnValue({
      access_token: "access token",
      secret: "secret",
      token: "token",
    });

    const rendered = shallow(<SignedIn />);
    expect(rendered).toMatchSnapshot();
    expect(checkSecret).toHaveBeenCalledTimes(1);
    expect(extractInfoFromHash).toHaveBeenCalledTimes(1);
    expect(Router.pushRoute).toHaveBeenCalledWith("index");
  });
  it("fails without token", () => {
    // tslint:disable-next-line
    const consoleErrorSave = console.error;
    // tslint:disable-next-line
    console.error = jest.fn();
    checkSecret.mockReturnValue(false);
    extractInfoFromHash.mockReturnValue({
      access_token: "access token",
      secret: "secret",
      token: null,
    });

    const rendered = shallow(<SignedIn />);
    expect(rendered).toMatchSnapshot();
    expect(checkSecret).toHaveBeenCalledTimes(1);
    expect(extractInfoFromHash).toHaveBeenCalledTimes(1);
    expect(Router.pushRoute).not.toHaveBeenCalled();
    // tslint:disable-next-line
    expect(console.error).toHaveBeenCalled();
    // tslint:disable-next-line
    console.error = consoleErrorSave;
  });
});

import { shallow } from "enzyme";
import * as React from "react";

describe("Sign In", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("renders", () => {
    const logout = jest.fn();
    const unsetToken = jest.fn();
    jest.doMock("../../../lib/auth/lock", () => ({
      logout,
    }));
    jest.doMock("../../../lib/auth/index", () => ({
      unsetToken,
    }));
    const SignOut = require("../sign-out").default;
    const rendered = shallow(<SignOut />);
    expect(rendered).toMatchSnapshot();
    expect(logout).toHaveBeenCalled();
    expect(unsetToken).toHaveBeenCalled();
  });
});

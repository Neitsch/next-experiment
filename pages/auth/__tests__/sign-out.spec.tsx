import { shallow } from "enzyme";
import React from "react";

import { unsetToken } from "../../../lib/auth/index";
import { logout } from "../../../lib/auth/lock";
import SignOut from "../sign-out";

jest.unmock("../sign-out");

describe("Sign In", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("renders", () => {
    const rendered = shallow(<SignOut />);
    expect(rendered).toMatchSnapshot();
    expect(logout).toHaveBeenCalled();
    expect(unsetToken).toHaveBeenCalled();
  });
  it("cache reset", () => {
    const rendered = shallow(<SignOut />);
    const fn = rendered.props().children;
    const data = {
      cache: {
        reset: jest.fn(),
      },
    };
    fn(data);
    expect(data.cache.reset).toHaveBeenCalled();
  });
});

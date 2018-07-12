import { shallow } from "enzyme";
import * as React from "react";

describe("Sign In", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("renders", () => {
    const show = jest.fn();
    jest.doMock("../../../lib/auth/lock", () => ({
      show,
    }));
    const SignIn = require("../sign-in").default;
    const rendered = shallow(<SignIn />);
    expect(rendered).toMatchSnapshot();
    expect(show).toHaveBeenCalledWith(rendered.prop("id"));
  });
});

import { shallow } from "enzyme";
import React from "react";

import { show } from "../../../lib/auth/lock";
import SignIn from "../sign-in";

jest.unmock("../sign-in");

describe("Sign In", () => {
  it("renders", () => {
    const rendered = shallow(<SignIn />);
    expect(rendered).toMatchSnapshot();
    expect(show).toHaveBeenCalledWith(rendered.prop("id"));
  });
});

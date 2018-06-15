import { shallow } from "enzyme";
import React from "react";

import Index from "../index";

describe("Index page", () => {
  it("renders", () => {
    expect(shallow(<Index />)).toMatchSnapshot();
  });
});

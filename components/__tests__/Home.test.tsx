import { shallow } from "enzyme";
import React from "react";

describe("Home", () => {
  let shallowRender;
  beforeEach(() => {
    jest.resetModules();
    const Home = require("../Home").default;
    shallowRender = shallow(<Home data={{ user: "Test User" }} />);
  });
  it("renders", () => {
    expect(shallowRender).toMatchSnapshot();
  });
});

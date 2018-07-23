import { shallow } from "enzyme";
import React from "react";

import Home from "../Home";

jest.unmock("../Home");

describe("Home", () => {
  describe("renders", () => {
    it("username", () => {
      const shallowRender = shallow(
        <Home data={{ user: { id: "test-id", username: "Test User" } }} />,
      );
      expect(shallowRender).toMatchSnapshot();
    });
    it("no username", () => {
      const shallowRender = shallow(
        <Home data={{ user: { id: "test-id" } }} />,
      );
      expect(shallowRender).toMatchSnapshot();
    });
  });
});

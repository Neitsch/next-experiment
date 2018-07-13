import { shallow } from "enzyme";
import React from "react";

describe("AppBar", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("unauthenticated", () => {
    let AppBarRendered = null;
    beforeEach(() => {
      const CondorAppBar = require("../CondorAppBar").CondorAppBar;
      const AppBarComponent = (
        <CondorAppBar isAuthenticated={false} classes={{ flex: "flex" }} />
      );
      AppBarRendered = shallow(AppBarComponent);
    });
    it("renders", () => {
      expect(AppBarRendered).toMatchSnapshot();
    });
  });
  describe("authenticated", () => {
    let AppBarRendered = null;
    beforeEach(() => {
      const CondorAppBar = require("../CondorAppBar").CondorAppBar;
      const AppBarComponent = (
        <CondorAppBar isAuthenticated={true} classes={{ flex: "flex" }} />
      );
      AppBarRendered = shallow(AppBarComponent);
    });
    it("renders", () => {
      expect(AppBarRendered).toMatchSnapshot();
    });
    it("Open Menu", () => {
      const method = AppBarRendered.find("#accountButton").props().onClick;
      const anchorElem = jest.fn();
      method({ currentTarget: anchorElem });
      expect(AppBarRendered.state("openAccountMenu")).toEqual(anchorElem);
    });
  });
});

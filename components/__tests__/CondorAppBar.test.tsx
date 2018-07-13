import { createShallow } from "@material-ui/core/test-utils";
import React from "react";

describe("AppBar", () => {
  let shallow;
  beforeEach(() => {
    jest.resetModules();
    shallow = createShallow({ dive: true });
  });
  describe("unauthenticated", () => {
    let AppBarRendered = null;
    beforeEach(() => {
      const CondorAppBar = require("../CondorAppBar").default;
      const AppBarComponent = <CondorAppBar isAuthenticated={false} />;
      AppBarRendered = shallow(AppBarComponent);
    });
    it("renders", () => {
      expect(AppBarRendered).toMatchSnapshot();
    });
  });
  describe("authenticated", () => {
    let AppBarRendered = null;
    beforeEach(() => {
      const CondorAppBar = require("../CondorAppBar").default;
      const AppBarComponent = <CondorAppBar isAuthenticated={true} />;
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

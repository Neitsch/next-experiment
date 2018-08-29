import { createShallow } from "@material-ui/core/test-utils";
import React from "react";

import { Router } from "../../lib/routes";
import CondorAppBar from "../CondorAppBar";

jest.unmock("../CondorAppBar");
jest.mock("graphql-tag", () =>
  jest.fn().mockImplementation(a => ({
    data: a,
  })),
);

describe("AppBar", () => {
  let shallow;
  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });
  describe("unauthenticated", () => {
    let AppBarRendered = null;
    beforeEach(() => {
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
    it("Logout", () => {
      AppBarRendered.setState({
        openAccountMenu: AppBarRendered, // Dummy element
      });
      const queryComponent = AppBarRendered.find("#query")
        .props()
        .children({ data: { user: { username: "Test Username" } } });
      const queryRender = shallow(queryComponent);
      expect(queryRender).toMatchSnapshot();

      const queryComponentNoUsername = AppBarRendered.find("#query")
        .props()
        .children({ data: { user: {} } });
      const queryRenderNoUsername = shallow(queryComponentNoUsername);
      expect(queryRenderNoUsername).toMatchSnapshot();

      expect(
        AppBarRendered.find("#query")
          .props()
          .children({ data: {} }),
      ).toBeNull();

      const method = queryRender.find("#logout").props().onClick;
      method();
      expect(Router.pushRoute).toHaveBeenCalledTimes(1);

      const settings = queryRender.find("#settingsButton").props().onClick;
      settings();
      expect(Router.pushRoute).toHaveBeenCalledTimes(2);

      const onCloseMethod = queryRender.find("#menu-appbar").props().onClose;
      expect(AppBarRendered.state("openAccountMenu")).not.toBeNull();
      onCloseMethod();
      expect(AppBarRendered.state("openAccountMenu")).toBeNull();
      expect(AppBarRendered.exists("#query")).toBeFalsy();
    });
  });
});

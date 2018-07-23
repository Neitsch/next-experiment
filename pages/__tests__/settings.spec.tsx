import { shallow } from "enzyme";
import React from "react";

import { getLocalCookie, getServerCookie } from "../../lib/auth/index";
import { Router } from "../../lib/routes";
import Settings from "../settings";

jest.unmock("../settings");

describe("Settings page", () => {
  it("Initial props", async () => {
    getLocalCookie.mockReturnValue("local");
    getServerCookie.mockReturnValue("server");
    process.browser = false;
    const retServer = await Settings.getInitialProps({ req: jest.fn() });
    expect(retServer).toEqual({ isAuthenticated: "server" });
    expect(getServerCookie).toHaveBeenCalledTimes(1);
    process.browser = true;
    const retLocal = await Settings.getInitialProps({});
    expect(retLocal).toEqual({ isAuthenticated: "local" });
    expect(getLocalCookie).toHaveBeenCalledTimes(1);
  });
  describe("Renders", () => {
    it("Authenticated", () => {
      const component = shallow(<Settings isAuthenticated={true} />);
      expect(component).toMatchSnapshot();
      expect(Router.pushRoute).not.toHaveBeenCalled();
    });
    it("Unauthenticated", () => {
      const component = shallow(<Settings isAuthenticated={false} />);
      expect(component).toMatchSnapshot();
      expect(Router.pushRoute).toHaveBeenCalled();
    });
  });
});

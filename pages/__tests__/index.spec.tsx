import { shallow } from "enzyme";
import React from "react";

import { getLocalCookie, getServerCookie } from "../../lib/auth/index";
import Index from "../index";

jest.unmock("../index");
jest.mock("graphql-tag", () =>
  jest.fn().mockImplementation(a => ({
    data: a,
  })),
);
jest.doMock("../../lib/routes", () => ({
  Link: () => <div>Link</div>,
}));

describe("Index page", () => {
  it("Initial props", async () => {
    getLocalCookie.mockReturnValue("local");
    getServerCookie.mockReturnValue("server");
    process.browser = false;
    const retServer = await Index.getInitialProps({ req: jest.fn() });
    expect(retServer).toEqual({ isAuthenticated: "server" });
    expect(getServerCookie).toHaveBeenCalledTimes(1);
    process.browser = true;
    const retLocal = await Index.getInitialProps({});
    expect(retLocal).toEqual({ isAuthenticated: "local" });
    expect(getLocalCookie).toHaveBeenCalledTimes(1);
  });
  describe("Renders", () => {
    it("unauth", () => {
      expect(shallow(<Index isAuthenticated={false} />)).toMatchSnapshot();
    });
    describe("auth", () => {
      let shallowRendered;
      beforeEach(() => {
        shallowRendered = shallow(<Index isAuthenticated={true} />);
      });
      it("Exists", () => {
        expect(shallowRendered).toMatchSnapshot();
      });
      describe("Query", () => {
        it("Loading", () => {
          expect(
            shallowRendered.props().children({ loading: true }),
          ).toMatchSnapshot();
        });
        it("Error", () => {
          expect(
            shallowRendered.props().children({
              error: { message: "Test Error" },
              loading: false,
            }),
          ).toMatchSnapshot();
        });
        it("Data", () => {
          expect(
            shallowRendered
              .props()
              .children({ loading: false, data: "Test Data" }),
          ).toMatchSnapshot();
        });
      });
    });
  });
});

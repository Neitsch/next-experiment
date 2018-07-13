import { shallow } from "enzyme";
import React from "react";

describe("Index page", () => {
  it("Initial props", async () => {
    jest.resetAllMocks();
    jest.resetModules();
    const getLocalCookie = jest.fn().mockImplementation(() => "local");
    const getServerCookie = jest.fn().mockImplementation(() => "server");
    jest.doMock("../../lib/auth/index", () => ({
      getLocalCookie,
      getServerCookie,
    }));
    jest.doMock("../../lib/routes", () => ({
      Link: () => <div>Link</div>,
    }));
    const Index = require("../index").default;
    process.browser = false;
    const retServer = await Index.getInitialProps({ req: jest.fn() });
    expect(retServer).toEqual({ isAuthenticated: "server" });
    expect(getServerCookie).toHaveBeenCalledTimes(1);
    process.browser = true;
    const retLocal = await Index.getInitialProps();
    expect(retLocal).toEqual({ isAuthenticated: "local" });
    expect(getLocalCookie).toHaveBeenCalledTimes(1);
  });
  describe("Renders", () => {
    it("unauth", () => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock("graphql-tag");
      jest.doMock("next/link");
      jest.doMock("react-apollo");
      const Index = require("../index").default;
      expect(shallow(<Index isAuthenticated={false} />)).toMatchSnapshot();
    });
    describe("auth", () => {
      let shallowRendered;
      beforeEach(() => {
        jest.resetModules();
        const Index = require("../index").default;
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

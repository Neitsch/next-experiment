import { mount, shallow } from "enzyme";
import React, { Children } from "react";
/* tslint:disable-next-line */
import { MockedProvider } from "react-apollo/test-utils";

const ContainerMock = mockData =>
  class MyMock extends React.Component {
    public render() {
      return this.props.children(mockData);
    }
  };

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
  it("renders unauth", () => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.doMock("graphql-tag");
    jest.doMock("next/link");
    jest.doMock("react-apollo");
    const Index = require("../index").default;
    expect(shallow(<Index isAuthenticated={false} />)).toMatchSnapshot();
  });
  describe("renders auth", () => {
    it("Loading", () => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock("graphql-tag");
      jest.doMock("next/link");
      jest.doMock("react-apollo", () => ({
        Query: ContainerMock({ data: {}, error: null, loading: true }),
      }));
      const Index = require("../index").default;
      expect(mount(<Index isAuthenticated={true} />)).toMatchSnapshot();
    });
    it("Error", () => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock("graphql-tag");
      jest.doMock("next/link");
      jest.doMock("react-apollo", () => ({
        Query: ContainerMock({ data: {}, error: {}, loading: false }),
      }));
      const Index = require("../index").default;
      expect(mount(<Index isAuthenticated={true} />)).toMatchSnapshot();
    });
    it("Data", () => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock("graphql-tag");
      jest.doMock("next/link");
      jest.doMock("react-apollo", () => ({
        Query: ContainerMock({
          data: { user: "Hi!" },
          error: null,
          loading: false,
        }),
      }));
      const Index = require("../index").default;
      expect(mount(<Index isAuthenticated={true} />)).toMatchSnapshot();
    });
  });
});

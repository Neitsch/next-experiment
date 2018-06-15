import { shallow } from "enzyme";
import React from "react";

import withApolloClient from "../withApolloClient";

jest.mock("apollo-client", () => ({
  ApolloClient: ({ children }) => children,
}));
jest.mock("../initApollo", () => data => ({
  cache: {
    extract: () => ({}),
  },
}));
jest.mock("next/head", () => ({
  rewind: jest.fn(),
}));

/* tslint:disable */
class TestClassWithInit extends React.Component {
  public static async getInitialProps(ctx) {
    TestClass.ctx = ctx;
  }
  private static ctx: any;
  public render() {
    return <div>{TestClass.ctx}</div>;
  }
}
class TestClass extends React.Component {
  private static ctx: any;
  public render() {
    return <div>{TestClass.ctx}</div>;
  }
}
/* tslint:enable */

describe("SSR", () => {
  it("Renders", async () => {
    jest.doMock("react-apollo", () => ({
      getDataFromTree: async () => <div />,
    }));
    const App = withApolloClient(TestClassWithInit);
    await App.getInitialProps({});
    const rendered = shallow(<App apolloState={{ data: {} }} />);
    expect(rendered).toMatchSnapshot();
  });

  it("Data Exception", async () => {
    process.browser = true;
    jest.doMock("react-apollo", () => ({
      getDataFromTree: async () => {
        throw Error();
      },
    }));
    const App = withApolloClient(TestClass);
    await App.getInitialProps({});
    const rendered = shallow(<App apolloState={{ data: {} }} />);
    expect(rendered).toMatchSnapshot();
  });
});

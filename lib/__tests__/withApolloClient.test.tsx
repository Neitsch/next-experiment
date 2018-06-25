import { shallow } from "enzyme";
import React from "react";

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
  beforeEach(() => {
    jest.doMock("apollo-client", () => ({
      ApolloClient: ({ children }) => children,
    }));
    jest.doMock("../initApollo", () => data => ({
      cache: {
        extract: () => ({}),
      },
    }));
    jest.doMock("next/head", () => ({
      rewind: jest.fn(),
    }));
    jest.doMock("../auth/index", () => ({
      getLocalCookie: () => "Cooookies",
      getServerCookie: a => a,
    }));
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });
  it("Renders", async () => {
    jest.doMock("react-apollo", () => ({
      getDataFromTree: async () => <div />,
    }));
    const withApolloClient = require("../withApolloClient").default;
    const App = withApolloClient(TestClassWithInit);
    await App.getInitialProps({ ctx: { req: {} } });
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
    const withApolloClient = require("../withApolloClient").default;
    const App = withApolloClient(TestClass);
    await App.getInitialProps({ ctx: { req: {} } });
    const rendered = shallow(<App apolloState={{ data: {} }} />);
    expect(rendered).toMatchSnapshot();
  });
});

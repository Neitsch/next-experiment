import { shallow } from "enzyme";
import React from "react";

import { getPageContext } from "../../lib/material-helper";
import withApolloClient from "../../lib/withApolloClient";
import App from "../_app";

jest.unmock("../_app");
jest.mock("../../lib/withApolloClient", () => () => a => a);
jest.mock("apollo-client", () => ({
  ApolloClient: ({ children }) => children,
}));
jest.mock("react-apollo", () => ({
  ApolloProvider: ({ children }) => children,
}));
getPageContext.mockReturnValue({
  generateClassName: jest.fn(),
  sheetsManager: new Map(),
  sheetsRegistry: {
    add: jest.fn(),
  },
  theme: {},
});

describe("App page", () => {
  it("renders", () => {
    const app = <App Component={() => <div />} apollo={jest.fn()} />;
    const rendered = shallow(app);
    expect(rendered).toMatchSnapshot();
  });
  it("renders - with JSS", () => {
    const removeChild = jest.fn();
    document.querySelector = jest.fn().mockReturnValue({
      parentNode: {
        removeChild,
      },
    });
    const app = <App Component={() => <div />} apollo={jest.fn()} />;
    const rendered = shallow(app);
    expect(rendered).toMatchSnapshot();
    expect(removeChild).toHaveBeenCalled();
  });
});

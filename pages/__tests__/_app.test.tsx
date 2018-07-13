import { shallow } from "enzyme";
import React from "react";

import App from "../_app";

jest.mock("apollo-client", () => ({
  ApolloClient: ({ children }) => children,
}));
jest.mock("react-apollo", () => ({
  ApolloProvider: ({ children }) => children,
}));
jest.mock("../../lib/withApolloClient", () =>
  jest.fn().mockImplementation(x => x),
);
jest.doMock("next/app", () => {
  const Helper = ({ children }) => children;
  Helper.prototype.Container = ({ children }) => children;
  return Helper;
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
    expect(removeChild).toHaveBeenCalled();
  });
});

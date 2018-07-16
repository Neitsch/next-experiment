import { shallow } from "enzyme";
import * as React from "react";

class Helper extends React.Component {
  public render() {
    return <div>Hi!</div>;
  }
}

describe("Documents", () => {
  it("renders", () => {
    jest.mock("styled-jsx/server", () => () => false);
    const Document = require("../_document").default;
    const rendered = shallow(
      <Document
        pageContext={{ theme: { palette: { primary: { main: "test" } } } }}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it("init props server", async () => {
    const Document = require("../_document").default;
    const renderPage = jest.fn().mockImplementation(fn => {
      const wrapped = fn(Helper);
      const component = wrapped({ pageContext: { sheetsRegistry: {} } });
      expect(shallow(component)).toMatchSnapshot();
    });
    const propsInit = await Document.getInitialProps({
      renderPage,
      req: {
        params: { nonce: "ghi" },
      },
    });
    const jssFun = renderPage.mock.calls[0][0];
    const JssComp = jssFun(Helper);
    const JssInst = <JssComp />;
    const JssRender = shallow(JssInst);

    expect(JssRender).toMatchSnapshot();
    expect(propsInit).toMatchSnapshot();
  });
  it("init props client", async () => {
    process.browser = true;
    const Document = require("../_document").default;
    const renderPage = jest.fn().mockImplementation(fn => {
      const wrapped = fn(Helper);
      const component = wrapped({
        pageContext: { sheetsRegistry: {} },
      });
      expect(shallow(component)).toMatchSnapshot();
    });
    const propsInit = await Document.getInitialProps({
      renderPage,
      req: {
        params: { nonce: "ghi" },
      },
    });
    const jssFun = renderPage.mock.calls[0][0];
    const JssComp = jssFun(Helper);
    const JssInst = <JssComp />;
    const JssRender = shallow(JssInst);

    expect(JssRender).toMatchSnapshot();
    expect(propsInit).toMatchSnapshot();

    const propsInit2 = await Document.getInitialProps({
      renderPage,
      req: {
        params: { nonce: "ghi" },
      },
    });
  });
});

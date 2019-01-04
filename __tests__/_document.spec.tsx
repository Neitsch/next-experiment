import { shallow } from "enzyme";
import React from "react";
// tslint:disable-next-line
import StyledJsxServer from "styled-jsx/server";

import Document from "../pages/_document";

jest.unmock("../pages/_document");

class Helper extends React.Component {
  public render() {
    return <div>Hi!</div>;
  }
}

describe("Documents", () => {
  it("renders", () => {
    StyledJsxServer.mockReturnValue(false);
    const rendered = shallow(
      <Document
        pageContext={{ theme: { palette: { primary: { main: "test" } } } }}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it("init props server", async () => {
    const renderPage = jest.fn().mockImplementation(fn => {
      const wrapped = fn(Helper);
      const component = wrapped({ pageContext: { sheetsRegistry: {} } });
      expect(shallow(component)).toMatchSnapshot();
    });
    const propsInit = await Document.getInitialProps({
      renderPage,
      res: {
        locals: { nonce: "ghi" },
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
    const renderPage = jest.fn().mockImplementation(fn => {
      const wrapped = fn(Helper);
      const component = wrapped({
        pageContext: { sheetsRegistry: {} },
      });
      expect(shallow(component)).toMatchSnapshot();
    });
    const propsInit = await Document.getInitialProps({
      renderPage,
      res: {
        locals: { nonce: "ghi" },
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
      res: {
        locals: { nonce: "ghi" },
      },
    });
  });
});

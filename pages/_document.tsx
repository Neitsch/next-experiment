import { SheetsRegistry } from "jss";
/* tslint:disable-next-line */
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
/* tslint:disable-next-line */
import JssProvider from "react-jss/lib/JssProvider";
/* tslint:disable-next-line */
import flush from "styled-jsx/server";

/* tslint:disable-next-line */
import green from "@material-ui/core/colors/green";
/* tslint:disable-next-line */
import purple from "@material-ui/core/colors/purple";
import {
  createGenerateClassName,
  createMuiTheme,
  /* tslint:disable-next-line */
} from "@material-ui/core/styles";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      dark: purple[700],
      light: purple[300],
      main: purple[500],
    },
    secondary: {
      dark: green[700],
      light: green[300],
      main: green[500],
    },
  },
});

function createPageContext() {
  return {
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    theme,
  };
}

function getPageContext() {
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}

class MyDocument extends Document {
  public static async getInitialProps(ctx) {
    const pageContext = getPageContext();
    const page = ctx.renderPage(Component => props => (
      <JssProvider
        registry={pageContext.sheetsRegistry}
        generateClassName={pageContext.generateClassName}
      >
        <Component pageContext={pageContext} {...props} />
      </JssProvider>
    ));

    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString(),
            }}
          />
          {flush() || null}
        </React.Fragment>
      ),
    };
  }
  public render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>My page</title>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              "user-scalable=0, initial-scale=1, " +
              "minimum-scale=1, width=device-width, height=device-height"
            }
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;

/* tslint:disable-next-line */
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
/* tslint:disable-next-line */
import JssProvider from "react-jss/lib/JssProvider";
/* tslint:disable-next-line */
import flush from "styled-jsx/server";

import { getPageContext } from "../lib/material-helper";

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
    /* 
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      />
    */
    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>Condor Club</title>
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

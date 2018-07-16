/* tslint:disable-next-line */
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
/* tslint:disable-next-line */
import flush from "styled-jsx/server";

class MyDocument extends Document {
  public static async getInitialProps(ctx) {
    let pageContext;
    const page = ctx.renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext;
        return <Component {...props} />;
      };
      return WrappedComponent;
    });
    const { nonce } = ctx.req.params;
    return {
      nonce,
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            nonce={nonce}
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
    const { pageContext, nonce } = this.props;
    /* 
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      />
    */
    return (
      <html lang="en" dir="ltr">
        <Head nonce={nonce}>
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
          <meta property="csp-nonce" content={nonce} />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </html>
    );
  }
}

export default MyDocument;

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { ApolloClient } from "apollo-client";
/* tslint:disable-next-line */
import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import JssProvider from "react-jss/lib/JssProvider";

import CondorAppBar from "../components/CondorAppBar";
import { getPageContext } from "../lib/material-helper";
import withApolloClient from "../lib/withApolloClient";

export class MyApp extends App<{
  apollo: ApolloClient<{}>;
  Component: React.Factory<{}>;
}> {
  private pageContext = null;
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }
  public componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  public render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <Container>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <CondorAppBar {...pageProps} />
              <Component pageContext={this.pageContext} {...pageProps} />
            </ApolloProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withApolloClient()(MyApp);

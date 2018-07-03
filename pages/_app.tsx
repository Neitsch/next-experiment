import { ApolloClient } from "apollo-client";
/* tslint:disable-next-line */
import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";

import withApolloClient from "../lib/withApolloClient";

class MyApp extends App<{
  apollo: ApolloClient<any>;
  Component: React.Factory<any>;
}> {
  public render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);

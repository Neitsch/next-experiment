import { ApolloClient } from "apollo-client";
/* tslint:disable-next-line */
import Head from "next/head";
import React from "react";
import { getDataFromTree } from "react-apollo";

import { getLocalCookie, getServerCookie } from "./auth/index";
import initApollo from "./initApollo";

export default App => {
  return class Apollo extends React.Component {
    public static displayName = "withApollo(App)";
    public static async getInitialProps(ctx) {
      const { Component, router } = ctx;
      const jwt = process.browser
        ? getLocalCookie()
        : getServerCookie(ctx.ctx.req);
      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }
      const apolloState = {
        data: {},
      };
      const apollo = initApollo({}, jwt);
      try {
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloState={apolloState}
            apolloClient={apollo}
          />,
        );
      } catch (error) {
        /* tslint:disable-next-line */
        console.warn("Error while running `getDataFromTree`", error);
      }

      if (!process.browser) {
        Head.rewind();
      }
      apolloState.data = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    private apolloClient: ApolloClient<any>;

    constructor(props) {
      super(props);
      this.apolloClient =
        props.apolloClient || initApollo(props.apolloState.data);
    }

    public render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};

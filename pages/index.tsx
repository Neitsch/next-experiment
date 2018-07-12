import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";

import Home, { HOME_QUERY } from "../components/Home";
import { getLocalCookie, getServerCookie } from "../lib/auth/index";
import { Link } from "../lib/routes";
import { HomeQuery } from "../query-types/HomeQuery";
// import { lock } from "../lib/auth/lock";

export const GET_USER = gql`
  query HomeQuery {
    ...HomeFragment
  }
  ${HOME_QUERY}
`;

export default class Index extends React.Component<{
  isAuthenticated: boolean;
}> {
  public static async getInitialProps(ctx) {
    const jwt = process.browser ? getLocalCookie() : getServerCookie(ctx.req);
    return {
      isAuthenticated: jwt,
    };
  }

  public render() {
    if (!this.props.isAuthenticated) {
      // if (process.browser) {
      // lock("").checkSession({}, (error, authResult) => {});
      // }
      return (
        <div>
          <h1 role="banner">Hello World</h1>
          <div role="navigation">
            <Link prefetch route="auth/sign-in">
              <a>Sign In</a>
            </Link>
          </div>
          <div role="main">This will be the landing page for Condor Club.</div>
        </div>
      );
    }
    return (
      <Query query={GET_USER}>
        {({ loading, error, data }: QueryResult<HomeQuery>) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>{error.message}</div>;
          }
          return <Home data={data} />;
        }}
      </Query>
    );
  }
}

import gql from "graphql-tag";
/* tslint:disable-next-line */
import Link from "next/link";
import React from "react";
import { Query } from "react-apollo";

import { getLocalCookie, getServerCookie } from "../lib/auth/index";

export const GET_USER = gql`
  query {
    user
  }
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
      return (
        <Link prefetch href="/auth/sign-in">
          <a>Sign In</a>
        </Link>
      );
    }
    return (
      <Query query={GET_USER}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>Error :(</div>;
          }

          return <span>{data.user}</span>;
        }}
      </Query>
    );
  }
}

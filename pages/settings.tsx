import React from "react";

import ChangeUsername from "../components/smart/ChangeUsername";
import { getLocalCookie, getServerCookie } from "../lib/auth/index";
import { Router } from "../lib/routes";

export default class Settings extends React.Component<{
  isAuthenticated: boolean;
}> {
  public static async getInitialProps(ctx) {
    const jwt = process.browser ? getLocalCookie() : getServerCookie(ctx.req);
    return {
      isAuthenticated: jwt,
    };
  }

  public componentDidMount() {
    if (!this.props.isAuthenticated) {
      Router.pushRoute("index");
    }
  }

  public render() {
    if (!this.props.isAuthenticated) {
      return <div />;
    }
    return <ChangeUsername />;
  }
}

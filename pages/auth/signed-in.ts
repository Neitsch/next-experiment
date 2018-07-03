/* tslint:disable-next-line */
import Router from "next/router";
import React from "react";

import {
  checkSecret,
  extractInfoFromHash,
  setToken,
} from "../../lib/auth/index";
import initApollo, { setupLink } from "../../lib/initApollo";

export default class SignedIn extends React.Component {
  public componentDidMount() {
    const { token, access_token, secret } = extractInfoFromHash();
    if (!checkSecret(secret) || !token) {
      /* tslint:disable-next-line */
      console.error("Something happened with the Sign In request");
      return;
    }
    setToken(token, access_token);
    const client = initApollo(token);
    client.link = setupLink(token);
    Router.router.push("/");
  }

  public render() {
    return null;
  }
}

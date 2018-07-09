import React from "react";

import {
  checkSecret,
  extractInfoFromHash,
  setToken,
} from "../../lib/auth/index";
import initApollo, { setupLink } from "../../lib/initApollo";
import { Router } from "../../lib/routes";

export default class SignedIn extends React.Component {
  public componentDidMount() {
    const { token, access_token, secret, expires_in } = extractInfoFromHash();
    if (!checkSecret(secret) || !token) {
      /* tslint:disable-next-line */
      console.error("Something happened with the Sign In request");
      return;
    }
    setToken(token, access_token, parseInt(expires_in, 10));
    const client = initApollo(token);
    client.link = setupLink(token);
    Router.pushRoute("index");
  }

  public render() {
    return null;
  }
}

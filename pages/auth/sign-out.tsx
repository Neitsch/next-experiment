import React from "react";
import { ApolloConsumer } from "react-apollo";

import { unsetToken } from "../../lib/auth/index";
import { logout } from "../../lib/auth/lock";

export default class SignOut extends React.Component {
  public componentDidMount() {
    unsetToken();
    logout();
  }
  public render() {
    return (
      <ApolloConsumer>
        {client => {
          client.cache.reset();
          return null;
        }}
      </ApolloConsumer>
    );
  }
}

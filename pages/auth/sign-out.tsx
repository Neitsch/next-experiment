import React from "react";

import { unsetToken } from "../../lib/auth/index";
import { logout } from "../../lib/auth/lock";

export default class SignOut extends React.Component {
  public componentDidMount() {
    unsetToken();
    logout();
  }
  public render() {
    return null;
  }
}

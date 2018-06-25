import React from "react";

import { show } from "../../lib/auth/lock";

const CONTAINER_ID = "put-lock-here";

class SignIn extends React.Component {
  public componentDidMount() {
    show(CONTAINER_ID);
  }
  public render() {
    return <div id={CONTAINER_ID} />;
  }
}

export default SignIn;

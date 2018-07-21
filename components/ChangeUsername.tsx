import React from "react";
import TextField from "@material-ui/core/TextField";
import gql from "graphql-tag";
import { graphql, ChildProps } from "react-apollo";

import {
  ChangeUsernameVariables,
  ChangeUsername,
} from "../query-types/ChangeUsername";

interface IProps {}

type Props = ChildProps<IProps, ChangeUsername, ChangeUsernameVariables>;

type State = {
  username: string;
};

class ChangeUsernameComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
    };
  }
  public render() {
    console.log(this.props);
    if (this.props.data && this.props.data.error) {
      console.log(this.props.data.error);
    }
    return (
      <TextField
        onChange={this.usernameChange}
        onKeyPress={this.usernameSubmit}
      />
    );
  }
  private usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.currentTarget.value;
    this.setState(() => ({
      username,
    }));
  };
  private usernameSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode == 13 && this.props.mutate) {
      this.props.mutate({ variables: { username: this.state.username } });
    }
  };
}

const changeUsername = gql`
  mutation ChangeUsername($username: String!) {
    changeUsername(username: $username) {
      username
      id
    }
  }
`;

export default graphql<Props, ChangeUsername, ChangeUsernameVariables>(
  changeUsername,
)(ChangeUsernameComponent);

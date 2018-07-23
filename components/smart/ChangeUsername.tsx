import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn } from "react-apollo";

import {
  ChangeUsername,
  ChangeUsernameVariables,
} from "../../query-types/ChangeUsername";
import TextFieldWithEnterToSubmit from "../dumb/TextFieldWithEnterToSubmit";

const CHANGE_USERNAME = gql`
  mutation ChangeUsername($username: String!) {
    changeUsername(username: $username) {
      username
      id
    }
  }
`;

class ChangeUsernameComponent extends React.Component {
  public render() {
    return (
      <Mutation mutation={CHANGE_USERNAME}>
        {(
          changeUsername: MutationFn<ChangeUsername, ChangeUsernameVariables>,
        ) => (
          <TextFieldWithEnterToSubmit
            doClear
            onSubmit={username => {
              changeUsername({ variables: { username } });
            }}
          />
        )}
      </Mutation>
    );
  }
}

export default ChangeUsernameComponent;

import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
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
          { error },
        ) => {
          let errorInfo = [];
          if (error) {
            errorInfo = error.graphQLErrors
              .map(e => e.extensions.exception.details)
              .reduce((acc, val) => acc.concat(val), [])
              .map(e => <FormHelperText key={e}>{e}</FormHelperText>);
          }
          return (
            <FormControl error={!!error}>
              <TextFieldWithEnterToSubmit
                id="change-username-field"
                doClear
                onSubmit={username => {
                  changeUsername({ variables: { username } });
                }}
                textFieldProps={{
                  error: !!error,
                  label: "Enter new Username",
                }}
              />
              {errorInfo}
            </FormControl>
          );
        }}
      </Mutation>
    );
  }
}

export default ChangeUsernameComponent;

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import gql from "graphql-tag";
import React from "react";

import { HomeFragment } from "../query-types/HomeFragment";
import ChangeUsername from "./ChangeUsername";

export const USER_QUERY = gql`
  fragment UserFragment on User {
    username
    id
  }
`;

export const HOME_QUERY = gql`
  fragment HomeFragment on Query {
    user {
      ...UserFragment
    }
  }
  ${USER_QUERY}
`;

export default class Home extends React.Component<{ data: HomeFragment }> {
  public render() {
    return (
      <Card>
        <CardContent>
          <div>
            {this.props.data.user.id} -{" "}
            {this.props.data.user.username
              ? this.props.data.user.username
              : "Anonymous"}
          </div>
          <div>
            <ChangeUsername />
          </div>
        </CardContent>
      </Card>
    );
  }
}

import gql from "graphql-tag";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { HomeFragment } from "../query-types/HomeFragment";

export const HOME_QUERY = gql`
  fragment HomeFragment on Query {
    user
  }
`;

export default class Home extends React.Component<{ data: HomeFragment }> {
  render() {
    return (
      <Card>
        <CardContent>{this.props.data.user}</CardContent>
      </Card>
    );
  }
}

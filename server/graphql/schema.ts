import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const queryType = new GraphQLObjectType({
  fields: {
    user: {
      resolve: parent => parent,
      type: GraphQLString,
    },
  },
  name: "Query",
});

export default new GraphQLSchema({ query: queryType });

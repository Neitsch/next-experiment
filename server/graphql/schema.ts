import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const queryType = new GraphQLObjectType({
  fields: {
    user: {
      resolve: (_, ___, context) => context.userSub,
      type: GraphQLString,
    },
  },
  name: "Query",
});

export default new GraphQLSchema({ query: queryType });

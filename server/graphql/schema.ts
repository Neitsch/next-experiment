import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const queryType = new GraphQLObjectType({
  fields: {
    user: {
      resolve: (_source, _args, context, _info) => context.userSub,
      type: GraphQLString,
    },
  },
  name: "Query",
});

export default new GraphQLSchema({ query: queryType });

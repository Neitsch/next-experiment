import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Connection } from "typeorm";

import { User } from "../entity/account/User";
import GraphQLUser from "./GraphQLUser";

export default new GraphQLObjectType({
  fields: {
    changeUsername: {
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (
        _,
        { username },
        context: { userSub: string; connection: Connection },
      ) => {
        let user = await context.connection
          .getRepository(User)
          .findOne(context.userSub);
        if (!user) {
          throw new Error("User not registered");
        }
        user.username = username;
        user = await context.connection.getRepository(User).save(user);
        return user;
      },
      type: new GraphQLNonNull(GraphQLUser),
    },
  },
  name: "Mutation",
});

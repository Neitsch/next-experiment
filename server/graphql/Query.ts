import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Connection } from "typeorm";

import GraphQLUser from "./GraphQLUser";
import { User } from "../entity/account/User";

export default new GraphQLObjectType({
  fields: {
    user: {
      resolve: async (
        _,
        ___,
        context: { userSub: string; connection: Connection },
      ) => {
        let user = await context.connection
          .getRepository(User)
          .findOne(context.userSub);
        if (!user) {
          user = await context.connection
            .getRepository(User)
            .save(new User(context.userSub));
        }
        return user;
      },
      type: new GraphQLNonNull(GraphQLUser),
    },
  },
  name: "Query",
});

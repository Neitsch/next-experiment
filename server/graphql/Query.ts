import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { Connection } from "typeorm";

import { User } from "../entity/account/User";
import GraphQLUser from "./GraphQLUser";

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

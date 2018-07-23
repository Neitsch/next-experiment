import { UserInputError } from "apollo-server-express";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Joi from "joi";
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
        const { error } = Joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .label("Username")
          .required()
          .validate(username);
        if (error) {
          throw new UserInputError("Input Error", {
            details: error.details.map(d => d.message),
          });
        }
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

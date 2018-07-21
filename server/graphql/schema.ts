import { GraphQLSchema } from "graphql";

import mutation from "./Mutation";
import query from "./Query";

export default new GraphQLSchema({ query, mutation });

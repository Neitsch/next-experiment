import { GraphQLSchema } from "graphql";

import query from "./Query";
import mutation from "./Mutation";

export default new GraphQLSchema({ query, mutation });

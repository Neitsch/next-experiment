import { writeFileSync } from "fs";
import { printSchema } from "graphql";

import Schema from "../server/graphql/schema";

const schema = printSchema(Schema);
writeFileSync("./schema.graphql", schema);

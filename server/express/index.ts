import { Express } from "express";

import graphql from "./graphql-server";
import next from "./nextHandle";
import security from "./security";
import common from "./setupCommonMiddleware";

export default (config: {
  dev: boolean;
  graphqlPath: string;
  initialContext: any;
}) => async (expressApp: Express) => {
  common(expressApp);
  security(config)(expressApp);
  graphql(config)(expressApp);
  await next(config)(expressApp);
};

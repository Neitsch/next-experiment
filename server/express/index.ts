import { Express } from "express";

import common from "./setupCommonMiddleware";
import security from "./security";
import graphql from "./graphql-server";
import next from "./nextHandle";

export default (config: {
  dev: boolean;
  graphqlPath: string;
  initialContext: any;
}) => (expressApp: Express) => {
  common(expressApp);
  security(config)(expressApp);
  graphql(config)(expressApp);
  next(config)(expressApp);
};

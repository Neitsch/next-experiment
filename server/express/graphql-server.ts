import { formatError } from "apollo-errors";
import { ApolloServer } from "apollo-server-express";
import { Express, Request, Response } from "express";
// @ts-ignore
import { createComplexityLimitRule } from "graphql-validation-complexity";

import GraphqlSchema from "../graphql/schema";

export const makeServer = ({
  dev,
  initialContext,
}: {
  dev: boolean;
  initialContext: any;
}) =>
  new ApolloServer({
    cacheControl: true,
    context: ({ req }: { req: Request }) => ({
      userSub: req.user.sub,
      ...initialContext,
    }),
    debug: dev,
    formatError,
    schema: GraphqlSchema,
    tracing: dev,
    validationRules: [
      createComplexityLimitRule(1000, {
        listFactor: 10,
        objectCost: 1,
        scalarCost: 1,
      }),
    ],
  });

export const errorReporting = (expressApp: Express) => {
  expressApp.use((error: Error, _: Request, res: Response, __: any) => {
    if (error) {
      res.json({ errors: [{ name: error.name, message: error.message }] });
    }
  });
};

export default ({
  dev,
  initialContext,
  graphqlPath,
}: {
  dev: boolean;
  initialContext: any;
  graphqlPath: string;
}) => (expressApp: Express) => {
  const apollo = makeServer({
    dev,
    initialContext,
  });
  apollo.applyMiddleware({
    app: expressApp,
    path: graphqlPath,
  });
  errorReporting(expressApp);
};

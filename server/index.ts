import { formatError } from "apollo-errors";
import {
  graphiqlExpress,
  graphqlExpress as graphqlHTTP,
} from "apollo-server-express";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressServer, {
  Request as RQ,
  RequestHandler,
  Response as RS,
} from "express";
import jwt from "express-jwt";
// @ts-ignore
import { createComplexityLimitRule } from "graphql-validation-complexity";
import jwksRsa from "jwks-rsa";
import nextServer from "next";
// import parseDbUrl from "parse-database-url";

import routes from "../lib/routes";
import GraphqlSchema from "./graphql/schema";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextServer({ dev });
const handle = routes.getRequestHandler(app);

const checkJwt = jwt({
  algorithms: ["RS256"],
  audience: "_ic7CjcpbO_QPqU-I0NT8C67vk16h9ee",
  issuer: "https://condor-club.auth0.com/",
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://condor-club.auth0.com/.well-known/jwks.json`,
    rateLimit: true,
  }),
});

app
  .prepare()
  .then(() => {
    // const dbConfig = parseDbUrl(process.env["DATABASE_URL"] ? );
    const server = expressServer();
    server.use(compression());
    server.use(
      cors({
        origin: "http://localhost:3000",
      }),
    );
    const cp: RequestHandler = cookieParser();
    server.use(cp);
    server.use(
      "/graphql",
      checkJwt,
      bodyParser.json(),
      graphqlHTTP(req => {
        let userId = null;
        if (req && req.user && req.user.sub) {
          userId = req.user.sub;
        }
        return {
          cacheControl: true,
          context: {
            userSub: userId,
          },
          formatError,
          rootValue: userId,
          schema: GraphqlSchema,
          tracing: dev,
          validationRules: [
            createComplexityLimitRule(1000, {
              listFactor: 10,
              objectCost: 1,
              scalarCost: 1,
            }),
          ],
        };
      }),
    );
    server.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
      }),
    );
    server.get("*", (req: RQ, res: RS) => {
      return handle(req, res);
    });
    server.use((error: Error, _: RQ, res: RS) => {
      res.json({ errors: [{ name: error.name, message: error.message }] });
    });
    server.listen(port, (err: Error) => {
      if (err) {
        throw err;
      }
    });
  })
  /* tslint:disable-next-line */
  .catch((c: Error) => console.error(c));

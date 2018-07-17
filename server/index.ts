import { formatError } from "apollo-errors";
import {
  graphiqlExpress,
  graphqlExpress as graphqlHTTP,
} from "apollo-server-express";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import helmet from "helmet";
// import parseDbUrl from "parse-database-url";
import { v4 as uuidv4 } from "uuid";

import routes from "../lib/routes";
import {
  bodyParser,
  compression,
  cookieParser,
  cors,
  expressServer,
  jwksRsa,
  jwt,
} from "../typeDefs/expressShim";
import { nextServer } from "../typeDefs/nextShim";
import GraphqlSchema from "./graphql/schema";

const port = parseInt(process.env.PORT, 10) || 3000;
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
    server.use(
      helmet({
        hsts: !dev,
        referrerPolicy: { policy: "same-origin" },
      }),
    );
    server.use(cookieParser());
    server.use(
      (_, res, next) => {
        res.locals.nonce = uuidv4();
        next();
      },
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'", "*.auth0.com"],
          scriptSrc: [
            "'self'",
            "*.auth0.com",
            /* istanbul ignore next */
            (_, res) => `'nonce-${res.locals.nonce}'`,
          ],
          styleSrc: [
            "'self'",
            "*.auth0.com",
            /* istanbul ignore next */
            (_, res) => `'nonce-${res.locals.nonce}'`,
            "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
            "'sha256-HHV9fpgXZciNMx/a9/fYJs5easPqtqmMjfsvEiT6J58='",
          ],
        },
      }),
    );
    server.use(
      "/graphql",
      checkJwt,
      bodyParser.json(),
      graphqlHTTP(req => ({
        cacheControl: true,
        context: {
          userSub: req.user.sub,
        },
        formatError,
        rootValue: req.user.sub,
        schema: GraphqlSchema,
        tracing: dev,
        validationRules: [
          createComplexityLimitRule(1000, {
            listFactor: 10,
            objectCost: 1,
            scalarCost: 1,
          }),
        ],
      })),
    );
    server.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
      }),
    );
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.use((error, _, res, __) => {
      res.json({ errors: [{ name: error.name, message: error.message }] });
    });
    server.listen(port, err => {
      if (err) {
        throw err;
      }
    });
  })
  /* tslint:disable-next-line */
  .catch(c => console.error(c));

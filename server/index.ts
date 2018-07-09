import {
  graphqlExpress as graphqlHTTP,
  graphiqlExpress,
} from "apollo-server-express";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import { formatError } from "apollo-errors";

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
    const server = expressServer();
    server.use(compression());
    server.use(
      cors({
        origin: "http://localhost:3000",
      }),
    );
    server.use(cookieParser());
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
            scalarCost: 1,
            objectCost: 1,
            listFactor: 10,
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
